/* eslint-disable import/no-extraneous-dependencies */
import qiniu from 'gulp-qiniu';

/**
 * sync directories to qiniu(relative to `root`)
 *
 * @example
 *
 * ```
 * ['qiniu', {dirs， sourceMap}]
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

  const { dirs, sourceMap = !0 } = (args && args[0]) || {};

  if (!dirs) throw new Error('dirs not configured');

  const realDirs = Array.isArray(dirs) ? dirs : [dirs];
  const src = [];
  realDirs.forEach(dir => {
    src.push(`${root}/${dir}/**/*`);
    if (!sourceMap) src.push(`!${root}/${dir}/**/*.map`);
  });

  return gulp.src(src, { base: root }).pipe(
    qiniu(
      {
        accessKey: 'uOLlfdbDvUrLvvfZ9MRwIsrrVg_6pEtuxeWajiKu',
        secretKey: 'AvW2PZPUkgy-vlHhI6gt1YQff2QtlksrXV3OwEzV',
        bucket: 'imgs',
        private: false,
      },
      {
        concurrent: 10,
      }
    )
  );
};
