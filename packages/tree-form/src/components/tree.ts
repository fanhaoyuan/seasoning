'use strict';

/**
  * @fileoverview 生成tree DOM
  * @example 
  * 
  * <div class=`${prefixClass}`>
  *     <TreeNode></TreeNode>
  * </div>
  */

import { createElement, addClassName, domTreeRender } from '../utils';
import { ITreeConfig } from '../types';
import TreeNode from './treeNode';
import { createObserver, IWatcher } from '../observer';
import eventEmitter from '../eventEmitter';

interface ITreeDOM {
    tree: HTMLDivElement
}

export default class Tree {
    config: ITreeConfig;
    constructor(config: Partial<ITreeConfig> = {}) {
        this.config = Object.assign(this.getDefaultConfig(), config);
    }

    getDefaultConfig(): ITreeConfig {
        return {
            prefixClass: 'tree-form',
            data: []
        }
    };

    setWatcher(): IWatcher<ITreeConfig> {
        return {

        }
    }

    bindEvents(elements: ITreeDOM) {
        eventEmitter.on('checkbox:onchange', (e: Event) => console.log('tree', e));
    }

    createDOM(): ITreeDOM {
        const { prefixClass } = this.config;

        const tree = createElement('div', {
            className: prefixClass
        });

        return { tree };
    }

    createDOMTree(elements: ITreeDOM) {
        const { tree } = elements;
        const { data, prefixClass } = this.config;

        const childrenNode = data.map(childData => {
            return {
                el: new TreeNode({ ...childData, prefixClass }).render()
            };
        });

        return {
            el: tree,
            children: childrenNode
        }
    };

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDOMTree(elements);
        return domTreeRender(domTree)
    };

}