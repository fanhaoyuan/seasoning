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

import { createElement, domTreeRender } from '../utils';
import { ITreeNodeConfig, NodeType } from '../types';
import { createObserver } from '../observer';
import Checkbox from './checkbox';
import Input from './input';
import Radio from './radio';
import eventEmitter from '../eventEmitter';

interface ITreeNodeDOM {
    treeNode: HTMLUListElement;
    treeNodeContainer: HTMLLIElement;
    treeNodeArrow: HTMLSpanElement;
    treeNodeTitle: HTMLSpanElement;
};

export default class TreeNode {
    config: ITreeNodeConfig;
    prefixClass: string = 'tree-form';
    el: HTMLElement | null = null;
    constructor(config: ITreeNodeConfig) {
        this.config = createObserver(config, {
            checked: {
                hander: (val, oldVal) => {
                    eventEmitter.emit(`${this.config.key}:checked`, val)
                }
            },
            expand: {
                hander: (val, oldVal) => {
                    // if (val === oldVal) return;
                    if (this.config?.children?.length) {
                        this.handleExpand(Boolean(val))
                    }
                }
            }
        });

        eventEmitter.on(`${this.config.key}:update`, (options: object) => this.update(options));
    };

    update(options: Partial<ITreeNodeConfig>) {
        Object.keys(options).forEach(key => {
            this.config[key] = options[key];
        });
    }

    handleExpand(expanded: boolean) {

        const treeNodeContainer = this.el?.querySelector('li');

        if (!treeNodeContainer) return;

        if (expanded && this.config?.children?.length) {
            const childrenNode = this.createChildrenNode();

            for (const childNode of childrenNode) {
                //@ts-ignore
                treeNodeContainer.appendChild(childNode.el);
            }

            return;
        };

        this.config.children?.forEach(_ => {
            const child = treeNodeContainer.querySelector(`.${this.prefixClass}-children`) as Node;
            treeNodeContainer.removeChild(child);
        });

    };

    bindEvents(elements: ITreeNodeDOM) {
        const { key } = this.config;
        const { treeNodeTitle, treeNode } = elements;

        treeNodeTitle.addEventListener('click', e => {
            this.config.expand = !this.config.expand;
        });

    }
    createDOM(): ITreeNodeDOM {
        const { prefixClass, config: { title } } = this;
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

    createChildrenNode() {
        const { children = [] } = this.config;

        return children.length ? children.map(child => {
            return {
                el: new TreeNode(child).render()
            };
        }) : [{
            el: null,
            shouldRender: false
        }]
    }

    createCustomNode(nodeType: NodeType, config: ITreeNodeConfig) {
        const nodeMap = {
            checkbox: Checkbox,
            radio: Radio,
            input: Input,
            text: TreeNode
        };

        return new nodeMap[nodeType](config);
    }

    createDOMTree(elements: ITreeNodeDOM) {
        const { treeNode, treeNodeContainer, treeNodeArrow, treeNodeTitle } = elements;

        const { nodeType, hasInput, expand } = this.config;

        const childrenNode: any = expand ? this.createChildrenNode() : [{ el: null, shouldRender: false }]

        return {
            el: treeNode,
            children: [
                {
                    el: treeNodeContainer,
                    children: [
                        {
                            el: treeNodeArrow
                        },
                        {
                            el: nodeType === 'checkbox'
                                ? new Checkbox(this.config).render()
                                : nodeType === 'radio'
                                    ? new Radio(this.config).render()
                                    : null,
                            shouldRender: Boolean(nodeType && ['checkbox', 'radio'].includes(nodeType))
                        },
                        {
                            el: treeNodeTitle
                        },
                        {
                            el: hasInput ? new Input(this.config).render() : null,
                            shouldRender: Boolean(hasInput)
                        },
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
        this.el = el;
        return el;
    }
}