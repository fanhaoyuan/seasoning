'use strict';

/**
 * @fileoverview 观察者模式
 * 函数自动观察数据对象，一旦数据有变化，函数就会自动执行。
 */

export type IWatcher<T extends object = {}> = {
    [key in keyof T]?: {
        hander: (value: T[key], oldValue: T[key]) => any;
        immediate?: boolean;
    };
};

export const createObserver = <T extends object>(target: T, watcher: IWatcher<T>): T => {
    return new Proxy(target, {
        get(target, propKey, receiver) {
            // console.log('GET ', propKey);
            return Reflect.get(target, propKey, receiver);
        },
        set(target, propKey, value, receiver) {
            // console.log('SET ', propKey);
            Object.keys(watcher).forEach(_key => {
                if (_key !== propKey ) return;
                watcher[propKey].hander(value, target[propKey]);
            });
            return Reflect.set(target, propKey, value, receiver);
        },
    })
};

export default createObserver;