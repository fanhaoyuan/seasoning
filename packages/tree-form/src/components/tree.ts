'use strict';

/**
  * @fileoverview 生成tree DOM
  * @example 
  * 
  * <div class=`${prefixClass}`>
  *     <TreeNode></TreeNode>
  * </div>
  */

import { createElement, addClassName, domTreeRender, uuid } from '../utils';
import { ITreeConfig, ITreeNodeConfig } from '../types';
import TreeNode from './treeNode';
import eventEmitter from '../eventEmitter';
import { createObserver } from '../observer';

interface ITreeDOM {
    tree: HTMLDivElement
}

export default class Tree {
    config: ITreeConfig;
    prefixClass: string = 'tree-form'
    constructor(config: ITreeConfig) {
        this.config = createObserver(config, {});

        eventEmitter.on('checkbox:change', (config: ITreeNodeConfig, checked: boolean) => {
            const data = this.config.data;

            const { key } = config;

            const target = this.findParentNodeByKey(key, data);

            const handle = (children: ITreeNodeConfig[]) => {
                for (const child of children) {
                    if (child.nodeType === 'radio') {
                        child.checked = false;
                        this.update(child.key, { checked: false })
                    }
                };
            };

            if (checked) {
                handle(target?.children || []);
            }
        });

        eventEmitter.on('radio:change', (config: ITreeNodeConfig, checked: boolean) => {
            const data = this.config.data;
            const { key } = config;
            const target = this.findParentNodeByKey(key, data);

            const handle = (children: ITreeNodeConfig[]) => {
                for (const child of children) {
                    if (child.key !== key) {
                        child.checked = false;
                        this.update(child.key, { checked: false })
                    } else {
                        child.checked = true;
                        this.update(child.key, { checked: true });
                    }
                };
            };

            handle(target?.children || []);
        });
    };

    update(key: string, options: Partial<ITreeNodeConfig>) {
        eventEmitter.emit(`${key}:update`, options)
    };

    loop(data: ITreeNodeConfig[], callback: Function) {
        for (const child of data) {
            callback(child)
            this.loop(child?.children || [], callback)
        };
    }

    findParentNodeByKey(key: string, data: ITreeNodeConfig[]): ITreeNodeConfig | undefined {
        for (const child of data) {
            if (child?.children?.some(_ => _.key === key)) {
                return child;
            }
            const res = this.findParentNodeByKey(key, child.children || [])
            if (res) return res;
        }
    };

    findNodeByKey(key: string, data: ITreeNodeConfig[]): ITreeNodeConfig | undefined {
        for (const child of data) {
            if (child.key === key) return child;
            const res = this.findNodeByKey(key, child.children || []);
            if (res) return res;
        }
    };

    createDOM(): ITreeDOM {
        const { prefixClass } = this;

        const tree = createElement('div', {
            className: prefixClass
        });

        return { tree };
    }

    createDOMTree(elements: ITreeDOM) {
        const { tree } = elements;
        const { data } = this.config;
        const childrenNode = data.map(childData => {
            return {
                el: new TreeNode(childData).render()
            };
        });

        return {
            el: tree,
            children: childrenNode
        };
    };

    render(): HTMLElement {
        const elements = this.createDOM();
        const domTree = this.createDOMTree(elements);
        return domTreeRender(domTree)
    };
}