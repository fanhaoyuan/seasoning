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
import eventEmitter from '../eventEmitter';
import { createObserver, IWatcher } from '../observer';

interface IInputConfig {
    prefixClass: string;
    value: string;
};

interface IInputDOM {
    inputWrapper: HTMLDivElement;
    input: HTMLInputElement;
}

export default class Input {
    config: IInputConfig;
    constructor(config: Partial<IInputConfig> = {}) {
        this.config = createObserver(Object.assign(this.getDefaultConfig(), config), this.setWatcher());
    };

    getDefaultConfig(): IInputConfig {
        const prefixClass = 'tree-form-input'
        return {
            prefixClass,
            value: ''
        }
    };

    setWatcher(): IWatcher<IInputConfig> {
        return {
            value: {
                hander(val, oldVal) {
                    eventEmitter.emit('input:onchange', val)
                }
            }
        }
    };

    createDOM(): IInputDOM {
        const { prefixClass, value } = this.config;
        const inputWrapper = createElement('div', {
            className: `${prefixClass}-wrapper`
        })
        const input = createElement('input', {
            spellcheck: false,
            autocomplete: 'off',
            type: 'text',
            className: prefixClass,
            value
        });

        return { inputWrapper, input }
    };

    bindEvents(elements: IInputDOM) {
        const { input } = elements;
        input.addEventListener('input', (e) => {
            eventEmitter.emit('input:oninput', e);
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
