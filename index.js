/*!
 * create-symlink | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/create-symlink
*/
'use strict';

const {inspect} = require('util');

const isPlainObj = require('is-plain-obj');
const {symlink} = require('graceful-fs');

const typeRe = /dir|file|junction/;
const caseInsensitiveTypeRe = /dir|file|junction/i;
const TYPE_ERROR = 'Expected `type` option to be a valid symlink type – \'dir\', \'file\' or \'junction\'';

module.exports = function createSymlink(target, path, option) {
  if (typeof target !== 'string') {
    return Promise.reject(new TypeError(
      'Expected a symlink target (string), but got a non-string value ' +
      inspect(target) +
      '.'
    ));
  }

  if (typeof path !== 'string') {
    return Promise.reject(new TypeError(
      'Expected a path (string) where to create a symlink, but got a non-string value ' +
      inspect(path) +
      '.'
    ));
  }

  if (option !== null && option !== undefined) {
    if (!isPlainObj(option)) {
      return Promise.reject(new TypeError(
        'The third argument of create-symlink must be an object, but got ' +
        inspect(option) +
        '.'
      ));
    }

    if (option.type !== undefined) {
      if (typeof option.type !== 'string') {
        return Promise.reject(new TypeError(`${TYPE_ERROR}, but got a non-strng value ${
          inspect(option.type)
        }.`));
      }

      if (option.type.length === 0) {
        return Promise.reject(new Error(`${TYPE_ERROR}, but got '' (empty string).`));
      }

      if (!typeRe.test(option.type)) {
        return Promise.reject(new Error(`${TYPE_ERROR}, but got an unknown type ${inspect(option.type)}.${
          caseInsensitiveTypeRe.test(option.type) ? ' Symlink type must be lower case.' : ''
        }`));
      }
    }
  } else {
    option = {type: null};
  }

  return new Promise((resolve, reject) => {
    symlink(target, path, option.type, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
