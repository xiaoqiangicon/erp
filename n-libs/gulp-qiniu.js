/**
 * src: https://github.com/senntyou/gulp-qiniu
 * 因为 github 被墙，gitee 禁止了公开访问，所以放到源码里
 *
 * 依赖如下(如果需要，可以添加到主项目的 package.json > devDependencies 中):
 * "gulp-util": "~2.2.9",
 * "minimatch": "^2.0.4",
 * "moment": "~2.7.0",
 * "q": "~1.0.1",
 * "qn": "^1.1.1",
 * "through2": "~0.4.0"
 */


var path = require('path');
var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var colors = require('gulp-util').colors;
var log = require('gulp-util').log;
var QN = require('qn');
var Moment = require('moment');
var Q = require('q');
var fs = require('fs')
var crypto = require('crypto')
var minimatch = require('minimatch')
var uploadedFiles = 0;
// var getEtag = require('./qetag')

// 计算文件的eTag，参数为buffer或者readableStream或者文件路径
function getEtag(buffer, callback) {

  // 判断传入的参数是buffer还是stream还是filepath
  var mode = 'buffer';

  if (typeof buffer === 'string') {
    buffer = require('fs').createReadStream(buffer);
    mode = 'stream';
  } else if (buffer instanceof require('stream')) {
    mode = 'stream';
  }

  // sha1算法
  var sha1 = function (content) {
    var crypto = require('crypto');
    var sha1 = crypto.createHash('sha1');
    sha1.update(content);
    return sha1.digest();
  };

  // 以4M为单位分割
  var blockSize = 4 * 1024 * 1024;
  var sha1String = [];
  var prefix = 0x16;
  var blockCount = 0;

  switch (mode) {
    case 'buffer':
      var bufferSize = buffer.length;
      blockCount = Math.ceil(bufferSize / blockSize);

      for (var i = 0; i < blockCount; i++) {
        sha1String.push(sha1(buffer.slice(i * blockSize, (i + 1) * blockSize)));
      }
      process.nextTick(function () {
        callback(null, calcEtag());
      });
      break;
    case 'stream':
      var stream = buffer;
      stream.on('readable', function () {
        var chunk;
        while (chunk = stream.read(blockSize)) {
          sha1String.push(sha1(chunk));
          blockCount++;
        }
      });
      stream.on('end', function () {
        callback(null, calcEtag());
      });
      break;
  }

  function calcEtag() {
    if (!sha1String.length) {
      return 'Fto5o-5ea0sNMlW_75VgGJCv2AcJ';
    }
    var sha1Buffer = Buffer.concat(sha1String, blockCount * 20);

    // 如果大于4M，则对各个块的sha1结果再次sha1
    if (blockCount > 1) {
      prefix = 0x96;
      sha1Buffer = sha1(sha1Buffer);
    }

    sha1Buffer = Buffer.concat(
      [new Buffer([prefix]), sha1Buffer],
      sha1Buffer.length + 1
    );

    return sha1Buffer.toString('base64')
      .replace(/\//g, '_').replace(/\+/g, '-');

  }

}

module.exports = function (qiniu, option) {
  option = option || {};
  option = extend({dir: '', versioning: false, versionFile: null, ignore: [], concurrent: 10}, option);

  var qn = QN.create(qiniu)
    , version = Moment().format('YYMMDDHHmm')
    , qs = []
    , filesIndex = 0

  return through2.obj(function (file, enc, next) {
    var that = this;
    var isIgnore = false;
    var filePath = path.relative(file.base, file.path);
    filePath = filePath.split(path.sep).join('/');

    if (file._contents === null) return next();
    option.ignore.forEach(function (item) {
      if (minimatch(filePath, item)) isIgnore = true;
    })
    if (isIgnore) return next();

    filesIndex++

    var fileKey = option.dir + ((!option.dir || option.dir[option.dir.length - 1]) === '/' ? '' : '/') + (option.versioning ? version + '/' : '') + filePath;
    var retries = 0;
    var isConcurrent = filesIndex % Math.floor(option.concurrent) !== 0

    var handler = function () {
      return Q.nbind(qn.stat, qn)(fileKey)
        .spread(function (stat) {
          return Q.nfcall(getEtag, file._contents)
            .then(function (fileHash) {
              // Skip when hash equal
              if (stat.hash === fileHash) return false;

              // Start
              log('Start →', fileKey);

              // Then delete
              return Q.nbind(qn.delete, qn)(fileKey)
            })
        }, function () {
          // Start
          log('Start →', fileKey);

          // Upload when not exists
          return true;
        })
        .then(function (isUpload) {
          if (isUpload === false) return false;
          return Q.nbind(qn.upload, qn)(file._contents, {key: fileKey})
        })
        .then(function (stat) {
          // No upload
          if (stat === false) {
            log('Skip →', colors.grey(fileKey));
            !isConcurrent && next()
            return;
          }

          // Record hash
          uploadedFiles++;

          log('Upload →', colors.green((qiniu.origin ? qiniu.origin  + '/' : '') + fileKey));
          !isConcurrent && next()
        }, function (err) {
          log('Error →', colors.red(fileKey), new PluginError('gulp-qiniu', err).message);
          that.emit('Error', colors.red(fileKey), new PluginError('gulp-qiniu', err));

          if (retries++ < 3) {
            log('Retry(' + retries + ') →', colors.red(fileKey));
            return handler()
          } else {
            !isConcurrent && next()
          }
        })
    }

    qs.push(handler())

    isConcurrent && next()
  }, function (next) {
    Q.all(qs)
      .then(function (rets) {
        log('Total →', colors.green(uploadedFiles + '/' + rets.length));

        // Check if versioning
        if (!option.versioning) {
          next();
          return;
        }
        log('Version →', colors.green(version));

        if (option.versionFile) {
          fs.writeFileSync(option.versionFile, JSON.stringify({version: version}))
          log('Write version file →', colors.green(option.versionFile));
        }

        next();
      }, function (err) {
        log('Failed upload →', err.message);
        throw err;
      });
  });

  function extend(target, source) {
    target = target || {};
    for (var prop in source) {
      if (typeof source[prop] === 'object') {
        target[prop] = extend(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }
    return target;
  }
};
