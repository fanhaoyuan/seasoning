'use strict';

import { IConfig, ITreeNodeConfig } from './types';
import { isString, isObject, uuid } from './utils';
import { Tree } from './components';
import eventEmitter from './eventEmitter';

export default class TreeForm {
    config!: IConfig;
    destroyed: boolean = false;
    isRender: boolean = false;
    constructor(config: Partial<IConfig> = {}) {
        this.config = Object.assign(this.getDefaultConfig(), config);
    };

    /**
     * @description 获取config中的值
     * @param {string} key config中的键
     * @returns {unknown} 对应key的值 
     */
    get<T extends keyof IConfig>(key: T): IConfig[T] {
        return this.config[key];
    };

    /**
     * @description 设置config中的值
     * @param {string | object} key config中的键 
     * @param {any} value 值
     * @returns {this} 
     */
    set<T extends keyof IConfig>(key: T | { [K in T]?: IConfig[K] }, value?: IConfig[T]): this {
        if (isString(key) && value) this.config[key] = value;
        if (isObject(key)) Object.assign(this.config, key);
        return this;
    };

    /**
     * @description 获取默认配置
     */
    getDefaultConfig(): IConfig {
        return {
            prefixClass: 'tree-form',
            data: [],
            container: ''
        };
    };

    getEvents() {
        return eventEmitter.events;
    }
    /**
     * @description 设置数据
     * @param {object} data
     */
    setData(data: ITreeNodeConfig[]): this {
        const loop = (array: ITreeNodeConfig[]) => {

            for (const child of array) {
                const { children = [], nodeType, expand = false, checked = false, value = '', key, inputOptions } = child;

                if (!key) child.key = uuid();

                if (nodeType === 'text') child.expand = true;
                else child.expand = expand;

                if (nodeType === 'checkbox' || nodeType === 'radio') child.checked = checked;
                else child.checked = false;

                if (nodeType === 'input') {
                    child.value = value;
                }
                else child.value = ''

                loop(children);
            };
        };

        loop(data);

        this.set('data', data);
        return this;
    };

    /**
     * @description 渲染函数（调用渲染）
     */
    render() {
        const data = this.get('data');
        const prefixClass = this.get('prefixClass');
        //@ts-ignore
        const tree = new Tree({ data, prefixClass }).render();

        const container = this.get('container');

        const containerNode = document.querySelector(container as string) as Element;

        const parentNode = containerNode.parentNode;

        parentNode?.replaceChild(tree, containerNode);

        this.isRender = true;
    };

    getData(): ITreeNodeConfig[] {
        return this.get('data');
    }
};
