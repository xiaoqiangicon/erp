
const jsonRefactor = require('json-refactor');

module.exports = req => {
    req.img = [];
    req.covers.forEach(url => {
        req.img.push({url});
    });

    delete req.covers;
    req.img = JSON.stringify(req.img);

    jsonRefactor(req.spec, [{
        benison: 'desc',
        indexImg: 'icon'
    }]);
    req.spec = JSON.stringify(req.spec);
};