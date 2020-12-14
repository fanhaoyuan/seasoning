'use strict';

import { ElementController } from './controllers';
import { IConfig, IData } from './types';
import { isString, isObject } from './utils';

export default class Tree {
    config!: IConfig;
    destoryed: boolean = false;
    constructor(config: Partial<IConfig>) {
        this.initConfig(config);
        this.set('elementController', new ElementController(this));
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
        const PREFIX_CLASS = 'tree-form';
        return {
            inputClassName: `${PREFIX_CLASS}-input`,
            radioClassName: `${PREFIX_CLASS}-radio`,
            checkboxClassName: `${PREFIX_CLASS}-checkbox`,
            textClassName: `${PREFIX_CLASS}-text`
        };
    };

    /**
     * @description 初始化配置项
     * @param {object} config 配置项 
     */
    initConfig(config: Partial<IConfig>) {
        this.set({ ...this.getDefaultConfig(), ...config })
    };

    /**
     * @description 设置数据
     * @param {object} data
     */
    setData(data: IData) {
        this.set('data', data);
    };

    /**
     * @description 渲染函数（调用渲染）
     */
    render() {

    }
};