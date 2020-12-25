'use strict';

/**
 * @fileoverview 生成input DOM
 * @example
 *
 * <div>
 *      <input autocomplete="off" spellcheck="false" type="text" class=`${prefixClass}`></input>
 * </div>
 */
import { createElement, domTreeRender, isString } from '../utils';
import { ITreeNodeConfig } from '../types';

interface IInputDOM {
    inputWrapper: HTMLDivElement;
    input: HTMLInputElement;
    inputPrefix: HTMLSpanElement | null;
    inputSuffix: HTMLSpanElement | null;
    inputGroupWrapper: HTMLSpanElement | null;
    inputLabel: HTMLLabelElement | null;
}

export default class Input {
    config: ITreeNodeConfig;
    prefixClass: string = 'tree-form-input';
    constructor(config: ITreeNodeConfig) {
        this.config = config;
    };


    createDOM(): IInputDOM {
        const { prefixClass, config: { value, inputOptions: { prefix, suffix, type = 'text', style = { width: '300px' } } = {}, title = '' } } = this;

        const hasPrefix = isString(prefix);
        const hasSuffix = isString(suffix);

        const inputStyle = Object.keys(style).reduce((pre: string, cur: string) => `${pre}${cur}:${style[cur]};`, '');

        const inputWrapper = createElement('div', {
            className: `${prefixClass}-wrapper${hasPrefix || hasSuffix ? ` ${prefixClass}-group` : ''}`,
        });

        const inputLabel = title ? createElement('label', {
            innerText: `${title}：`,
            className: `${prefixClass}-label`
        }) : null;

        const inputPrefix = hasPrefix ? createElement('span', {
            innerText: prefix,
            className: `${prefixClass}-group-addon`
        }) : null;

        const inputSuffix = hasSuffix ? createElement('span', {
            innerText: suffix,
            className: `${prefixClass}-group-addon`
        }) : null;

        const inputGroupWrapper = hasPrefix || hasSuffix ? createElement('span', {
            className: `${prefixClass}-group-wrapper`,
            style: inputStyle
        }) : null;

        const input = createElement('input', {
            spellcheck: false,
            autocomplete: 'off',
            type,
            className: prefixClass,
            value: type === 'number' ? value ? value : 0 : value ? value : '',
            style: inputGroupWrapper ? '' : inputStyle
        });

        return { inputWrapper, inputLabel, input, inputPrefix, inputSuffix, inputGroupWrapper };
    };

    bindEvents(elements: IInputDOM) {
        const { input } = elements;
        const { inputOptions: { type = 'text' } = {} } = this.config;

        if (type === 'text') {
            input.addEventListener('input', (e) => {
                //@ts-ignore
                this.config.value += e.data;
            });
        }

        if (type === 'date' || type === 'number') {
            input.addEventListener('change', e => {
                //@ts-ignore
                this.config.value = e.target?.value
            })
        }

    };

    createNormalDOMTree(elements: IInputDOM) {
        const { input, inputLabel } = elements;
        return inputLabel ?
            {
                el: inputLabel,
                children: [{
                    el: input
                }]
            }
            : {
                el: input
            }

    }

    createDomTree(elements: IInputDOM) {
        const { inputGroupWrapper, inputPrefix, inputSuffix, inputWrapper } = elements;
        // console.log(inputGroupWrapper, inputPrefix, inputSuffix)
        if (!inputGroupWrapper) return this.createNormalDOMTree(elements);

        return {
            el: inputGroupWrapper,
            children: [{
                el: inputWrapper,
                children: [
                    {
                        el: inputPrefix ? inputPrefix : null,
                        shouldRender: Boolean(inputPrefix)
                    },
                    this.createNormalDOMTree(elements),
                    {
                        el: inputSuffix ? inputSuffix : null,
                        shouldRender: Boolean(inputSuffix)
                    }]
            }]
        }
    }

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDomTree(elements);
        //@ts-ignore
        return domTreeRender(domTree);
    };
};
