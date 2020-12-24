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

import { addClassName, createElement, domTreeRender, getNullElement, removeClassName } from '../utils';
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
    arrow: HTMLElement | null = null
    constructor(config: ITreeNodeConfig) {
        this.config = createObserver(config, {
            checked: {
                hander: (val, oldVal) => {
                    eventEmitter.emit(`${this.config.key}:checked`, val)
                }
            },
            expand: {
                hander: (val, oldVal) => {
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

        if (!treeNodeContainer || !this.config?.children?.length || expanded === Boolean(this.config.expand)) return;

        if (expanded) {
            const childrenNode = this.createChildrenNode();

            for (const childNode of childrenNode) {
                //@ts-ignore
                treeNodeContainer.appendChild(childNode.el);
            }

            addClassName(this.arrow as HTMLElement, `${this.prefixClass}-arrow-open`);

            return;
        };

        this.config.children?.forEach(_ => {
            const loop = (config: ITreeNodeConfig) => {
                const { key, children = [] } = config;
                eventEmitter.off(`${key}:update`);
                eventEmitter.off(`${key}:checked`);

                for (const child of children) {
                    loop(child)
                }
            };

            loop(_);

            removeClassName(this.arrow as HTMLElement, `${this.prefixClass}-arrow-open`);

            const child = treeNodeContainer.querySelector(`.${this.prefixClass}-children`) as Node;

            treeNodeContainer.removeChild(child);
        });

    };

    bindEvents(elements: ITreeNodeDOM) {
        const { treeNodeArrow } = elements;

        if (treeNodeArrow) {
            // treeNodeArrow.addEventListener('click', () => this.config.checked = !this.config.checked);
        }

    }
    createArrow() {
        const { prefixClass } = this;
        const iconWrapper = createElement('i', {
            className: `${prefixClass}-icon`
        });

        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('viewBox', "0 0 1024 1024");
        iconSvg.setAttribute('width', "1em");
        iconSvg.setAttribute('height', "1em");
        iconSvg.setAttribute('fill', "currentColor");
        iconSvg.setAttribute("aria-hidden", 'true');
        iconSvg.setAttribute("focusable", 'false');

        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        iconPath.setAttribute('d', 'M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z');

        return domTreeRender({
            el: iconWrapper,
            children: [{
                //@ts-ignore
                el: iconSvg,
                children: [{
                    //@ts-ignore
                    el: iconPath
                }]
            }]
        })
    }

    createDOM(): ITreeNodeDOM {
        const { prefixClass, config: { title, expand } } = this;
        const treeNode = createElement('ul', {
            className: `${prefixClass}-children`
        });
        const treeNodeContainer = createElement('li');
        const treeNodeArrow = createElement('span', {
            className: `${prefixClass}-arrow${expand ? ` ${prefixClass}-arrow-open` : ''}`
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

    createCustomNode(nodeType: NodeType, config: ITreeNodeConfig, elements: ITreeNodeDOM) {
        const { treeNodeTitle } = elements;
        const nodeMap = {
            checkbox: Checkbox,
            radio: Radio,
            input: Input
        };

        const Node = nodeMap[nodeType];

        return {
            el: nodeType === 'text' ? treeNodeTitle : new Node(config).render()
        }
    }

    createDOMTree(elements: ITreeNodeDOM) {
        const { treeNode, treeNodeContainer, treeNodeArrow } = elements;

        const { nodeType = 'text', expand, children = [] } = this.config;

        const childrenNode: any = expand ? this.createChildrenNode() : [getNullElement()]

        const arrow = children.length && ['radio', 'checkbox'].includes(nodeType) ? { el: this.createArrow() } : getNullElement();

        this.arrow = treeNodeArrow;

        return {
            el: treeNode,
            children: [
                {
                    el: treeNodeContainer,
                    children: [
                        {
                            el: treeNodeArrow,
                            children: [arrow]
                        },
                        this.createCustomNode(nodeType, this.config, elements),
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