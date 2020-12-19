'use strict';

/**
  * @fileoverview 生成treeNode DOM
  * @example 
  * 
  * <ul class=`${PREFIX_CLASS}`>
  *      <li>
  *          <span class=`${PREFIX_CLASS}-arrow`></span>
  *          <Custom></Custom>
  *          <span class=`${PREFIX_CLASS}-title`>title</span>
  *          <TreeNode></TreeNode>
  *      </li>
  * </ul>
  */

import { createElement, addClassName, domTreeRender, uuid } from '../utils';
import { InputType, ITreeNodeConfig } from '../types';
import { createObserver, IWatcher } from '../observer';
import Checkbox from './checkbox';
import Input from './input';
import Radio from './radio';

interface ITreeNodeDOM {
    treeNode: HTMLUListElement;
    treeNodeContainer: HTMLLIElement;
    treeNodeArrow: HTMLSpanElement;
    treeNodeTitle: HTMLSpanElement;
};

export default class TreeNode {
    config: ITreeNodeConfig;
    watcher: IWatcher = {};
    constructor(config: Partial<ITreeNodeConfig> = {}) {
        this.config = createObserver(Object.assign(this.getDefaultConfig(), config), this.setWatcher());
    };

    getDefaultConfig(): ITreeNodeConfig {
        return {
            prefixClass: 'tree-form',
            title: '',
            children: [],
            key: uuid(6),
            expand: true,
            selected: false,
            checked: false,
            hasInput: false,
            nodeType: 'text'
        };
    };

    setWatcher(): IWatcher<ITreeNodeConfig> {
        return {
            key: {
                hander(value, oldValue) {
                    console.log(value, oldValue);
                }
            },
            expand: {
                hander(value, oldValue) {
                    console.log(value, oldValue)
                }
            }
        }
    };

    bindEvents(elements: ITreeNodeDOM) {
        const { treeNodeTitle } = elements;

        treeNodeTitle.addEventListener('click', e => {
            console.log(this.config);
            // this.config.expand = !this.config.expand
            this.config.key = '111'
        });
    }

    createDOM(): ITreeNodeDOM {
        const { prefixClass, title } = this.config;
        const treeNode = createElement('ul', {
            className: `${prefixClass}-children`
        });

        const treeNodeContainer = createElement('li');
        const treeNodeArrow = createElement('span', {
            className: `${prefixClass}-arrow`
        });
        const treeNodeTitle = createElement('span', {
            className: `${prefixClass}-title`,
            innerText: title
        });

        return { treeNode, treeNodeContainer, treeNodeArrow, treeNodeTitle };
    };

    createDOMTree(elements: ITreeNodeDOM) {
        const { treeNode, treeNodeContainer, treeNodeArrow, treeNodeTitle } = elements;

        const { children = [], prefixClass, nodeType, hasInput } = this.config;

        const childrenNode: any = children.map(child => {
            return {
                el: new TreeNode({ ...child, prefixClass }).render()
            }
        });

        // let optionNode, inputNode;
        // if (nodeType === 'checkbox') {
        //     optionNode = {
        //         el: new Checkbox().render()
        //     }

        // } else if (nodeType === 'radio') {
        //     optionNode = {
        //         el: new Radio().render()
        //     }
        // } else {
        //     optionNode = { el: null, shouldRender: false };
        // };

        // if (hasInput) {
        //     inputNode = { el: new Input().render() };
        // };

        return {
            el: treeNode,
            children: [
                {
                    el: treeNodeContainer,
                    children: [
                        {
                            el: treeNodeArrow
                        },
                        // optionNode,
                        {
                            el: treeNodeTitle
                        },
                        // inputNode,
                        ...childrenNode
                    ]
                }
            ]
        }
    }

    render() {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDOMTree(elements);
        const el = domTreeRender(domTree)
        return el;
    }
}