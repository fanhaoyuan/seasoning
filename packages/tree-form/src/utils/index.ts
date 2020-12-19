'use strict';

export * from './dom';
export * from './types';

/**
* @description 生成随机字符串(a-z,A-Z,0-9)组成的uuid 默认长度为32
* @param {Number} length 生成uuid的长度
* @return {String} uuid
*/

export const uuid = (length: number = 32): string => {

    const STRING_TEMPLATE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    const RANGE = STRING_TEMPLATE.length;

    let string = '';

    for (let i = 0; i < length; i++) {
        string += STRING_TEMPLATE.charAt(Math.floor(Math.random() * RANGE));
    };

    return string;
}