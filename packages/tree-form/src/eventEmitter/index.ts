'use strict';

const WILDCARD = '*';
interface IEvent {
    [key: string]: {
        callback: Function;
        once: boolean;
    }[]
}

class EventEmitter {
    events: IEvent = {};

    /**
     * @description 监听一个事件
     * @param event
     * @param callback
     * @param once
     */
    on(event: string, callback: Function, once: boolean = false): this {

        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push({ callback, once })

        return this;
    };

    /**
     * @description监听一个事件一次
     * @param event
     * @param callback
     */
    once(event: string, callback: Function): this {
        this.on(event, callback, true);
        return this;
    };

    /**
     * @description 取消监听一个事件，或者一个channel
     * @param event
     * @param callback
     */
    off(event: string, callback: Function) {
        if (!event) {
            // event 为空全部清除
            this.events = {};
        }
        else {
            if (!callback) {
                // event 存在，callback 为空，清除事件所有方法
                delete this.events[event];
            }
            else {
                // event 存在，callback 存在，清除匹配的
                const events = this.events[event] || [];
                let len = events.length;
                for (let i = 0; i < len; i++) {
                    if (events[i].callback === callback) {
                        events.splice(i, 1);
                        len--;
                        i--;
                    }
                }
                if (events.length === 0) {
                    delete this.events[event];
                }
            }
        }
        return this;
    }

    /**
     * 触发一个事件
     * @param event
     * @param args
     */
    emit(event: string, ...args: any[]) {
        const _this = this;

        const events = this.events[event] || [];
        const wildcardEvents = this.events[WILDCARD] || [];
        // 实际的处理 emit 方法
        var doEmit = function (es: IEvent[string]) {
            let length = es.length;
            for (var i = 0; i < length; i++) {
                if (!es[i]) {
                    continue;
                }
                const { callback, once } = es[i];

                if (once) {
                    es.splice(i, 1);
                    if (es.length === 0) {
                        delete _this.events[event];
                    }
                    length--;
                    i--;
                }
                callback.apply(_this, args);
            }
        };
        doEmit(events);
        doEmit(wildcardEvents);
    }
};

export default new EventEmitter();