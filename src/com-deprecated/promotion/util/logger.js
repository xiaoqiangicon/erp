'use strict';
let prefix = 'promotion: ';
export default {
  log: str => {
    console.log(prefix + str);
  },
  info: str => {
    console.info(prefix + str);
  },
  warn: str => {
    console.warn(prefix + str);
  },
  error: str => {
    console.error(prefix + str);
  },
  throwError: str => {
    throw new Error(prefix + str);
  },
};
