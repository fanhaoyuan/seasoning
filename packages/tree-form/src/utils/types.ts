'use strict';

/**
 * @description 检查指定值的类型
 * @param {unknown} value 检查的值
 * @return {string} 类型 
 */
export const typeOf = (value: unknown): string => {
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[Function.prototype.call.bind(Object.prototype.toString)(value)] || 'unknown';
}

/**检查是否为string类型 */
export const isString = (value: unknown): value is string => typeOf(value) === 'string';
/**检查是否为object类型 */
export const isObject = (value: unknown): value is object => typeOf(value) === 'object';
/**检查是否为array类型 */
export const isArray = (value: unknown): value is Array<any> => typeOf(value) === 'array';
/**检查是否为undefined类型 */
export const isUndefined = (value: unknown): value is undefined => typeOf(value) === 'undefined';
/**检查是否为function类型 */
export const isFunction = (value: unknown): value is Function => typeOf(value) === 'function';
