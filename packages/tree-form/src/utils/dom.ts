'use strict';

import { INullElement } from '../types';
import { isString } from './types';

/**
 * @description 创建元素 并绑定attrs
 * @param tagName 标签名
 * @param attrs 属性对象 
 */
export const createElement = <T extends keyof HTMLElementTagNameMap>(tagName: T, attrs: { [x: string]: any } = {}): HTMLElementTagNameMap[T] => {
    const element = document.createElement(tagName);

    Object.keys(attrs).forEach(key => element[key] = attrs[key]);

    return element;
};

/**
 * @description 为元素添加类名
 * @param element 元素
 * @param className 类名
 */
export const addClassName = <T extends HTMLElement>(element: T, className: string | string[]): T => {
    if (!className) return element;

    if (isString(className)) {
        element.classList.add(className);
        return element;
    };

    for (const _className of className) {
        element.classList.add(_className);
    }

    return element;
};

/**
 * @description 为元素删除类名
 * @param element 元素
 * @param className 类名
 */
export const removeClassName = <T extends HTMLElement>(element: T, className: string | string[]): T => {
    if (!className) return element;

    if (isString(className)) {
        element.classList.remove(className);
        return element;
    };

    for (const _className of className) {
        element.classList.remove(_className);
    }

    return element;
};

interface IDomTree {
    el: HTMLElement,
    children?: IDomTree[],
    shouldRender?: boolean
};

/**
 * @description 渲染domTree
 * @param domTree 
 */
export const domTreeRender = (domTree: IDomTree): HTMLElement => {
    const { children = [], el, shouldRender = true } = domTree;

    if (shouldRender) {
        for (const child of children) {
            const { shouldRender: childShouldRender = true } = child;
            if (childShouldRender) {
                const element = domTreeRender(child);
                el.appendChild(element);
            };
        };
    }

    return el;
};

/**
 * @description 获取空元素
 */
export const getNullElement = (): INullElement => {
    return {
        el: null,
        shouldRender: false
    }
}