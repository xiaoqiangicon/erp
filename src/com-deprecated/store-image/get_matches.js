import _ from 'underscore';
import data from './data';
import makeRegExp from './util/make_reg_exp';
export default content => {
  let regExps = makeRegExp();
  let result;
  let matches = [];
  regExps.forEach(regExp => {
    while ((result = regExp.exec(content))) {
      result[1] &&
        !data.whiteSpaceRegExp.test(result[1]) &&
        matches.push(
          result[1]
            .replace(data.leftTrimRegExp, '')
            .replace(data.rightTrimRegExp, '')
        );
    }
  });
  return _.filter(_.uniq(matches), url => {
    return url && !data.zzhRegExp.test(url);
  });
};
