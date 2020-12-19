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
        set(target, key, value, receiver) {
            Object.keys(watcher).forEach(_key => {
                if (_key !== key) return;
                watcher[_key].hander(value, target[key]);
            });
            target[key] = value;
            return true;
        }
    })
};

export default createObserver;