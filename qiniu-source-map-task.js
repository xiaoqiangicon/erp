/* eslint-disable import/no-extraneous-dependencies */
import qiniu from './n-libs/gulp-qiniu';

/**
 * sync source-map files to qiniu(relative to `root`)
 *
 * @example
 *
 * ```
 * ['qiniu-source-map', {dir}]
 * ```
 *
 * @param args
 * @param gulp
 * @param lila
 * @returns {function()}
 */
export default ({ args, gulp, lila }) => () => {
  const { getSettings } = lila;
  const [root] = getSettings(['root']);

  const { dir } = (args && args[0]) || {};

  if (!dir) throw new Error('dir not configured');

  const dirPath = `${root}/${dir}`;
  const src = `${dirPath}/**/*.map`;

  return gulp.src(src, { base: dirPath }).pipe(
    qiniu(
      {
        accessKey: 'uOLlfdbDvUrLvvfZ9MRwIsrrVg_6pEtuxeWajiKu',
        secretKey: 'AvW2PZPUkgy-vlHhI6gt1YQff2QtlksrXV3OwEzV',
        bucket: 'imgs',
        private: false,
      },
      {
        dir: 'source-map/',
        concurrent: 10,
      }
    )
  );
};
