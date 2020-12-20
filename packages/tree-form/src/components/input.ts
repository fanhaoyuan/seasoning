'use strict';

/**
 * @fileoverview 生成input DOM
 * @example
 *
 * <div>
 *      <input autocomplete="off" spellcheck="false" type="text" class=`${prefixClass}`></input>
 * </div>
 */
import { createElement, addClassName, removeClassName, domTreeRender } from '../utils';
import { ITreeNodeConfig } from '../types';

interface IInputDOM {
    inputWrapper: HTMLDivElement;
    input: HTMLInputElement;
}

export default class Input {
    config: ITreeNodeConfig;
    prefixClass: string = 'tree-form-input';
    constructor(config: ITreeNodeConfig) {
        this.config = config
    };


    createDOM(): IInputDOM {
        const { prefixClass, config: { value, inputOptions } } = this;
        const inputWrapper = createElement('div', {
            className: `${prefixClass}-wrapper`
        })
        const input = createElement('input', {
            spellcheck: false,
            autocomplete: 'off',
            type: 'text',
            className: prefixClass,
            ...inputOptions,
            value: value ? value : ''
        });

        return { inputWrapper, input }
    };

    bindEvents(elements: IInputDOM) {
        const { input } = elements;
        input.addEventListener('input', (e) => {
            //@ts-ignore
            this.config.value += e.data;
        });
    };

    createDomTree(elements: IInputDOM) {
        const { inputWrapper, input } = elements;

        return {
            el: inputWrapper,
            children: [{
                el: input
            }]
        }
    }

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDomTree(elements);
        return domTreeRender(domTree);
    };
};
