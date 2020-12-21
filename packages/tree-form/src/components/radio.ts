'use strict';

import eventEmitter from '../eventEmitter';
import { ITreeNodeConfig } from '../types';
/**
 * @fileoverview 生成radio DOM
 * @example
 *
 * <label class=`${prefixClass}-wrapper`>
 *      <span class=`${prefixClass}`>
 *          <span class=`${prefixClass}-inner`></span>
 *          <input class=`${prefixClass}-input`></input>
 *      </span>
 * </label>
 */
import { createElement, addClassName, domTreeRender, removeClassName } from '../utils';

const getCheckedClass = (prefixClass: string) => `${prefixClass}-checked`;

interface IRadioDOM {
    radioWrapper: HTMLLabelElement;
    radio: HTMLSpanElement;
    radioInner: HTMLSpanElement;
    radioInput: HTMLInputElement;
    radioTitle: HTMLSpanElement;
}

export default class Radio {
    config: ITreeNodeConfig;
    input!: HTMLElement;
    el!: HTMLElement;
    prefixClass: string = 'tree-form-radio';
    constructor(config: ITreeNodeConfig) {
        this.config = config;
        eventEmitter.on(`${this.config.key}:checked`, (checked: boolean) => {
            // console.log('radio', checked)
            this.setStateClasses(this.el, checked)
            //@ts-ignore
            this.input.checked = checked;
        })
    };

    createDOM(): IRadioDOM {
        const { prefixClass } = this;
        const { title } = this.config;
        const radioWrapper = createElement('label', {
            className: `${prefixClass}-wrapper`
        });
        const radio = createElement('span', {
            className: `${prefixClass}`
        });
        const radioInner = createElement('span', {
            className: `${prefixClass}-inner`
        });
        const radioInput = createElement('input', {
            type: 'radio',
            className: `${prefixClass}-input`
        });

        const radioTitle = createElement('span', {
            innerText: title
        });


        return { radioWrapper, radio, radioInner, radioInput, radioTitle };
    };

    createDomTree(elements: IRadioDOM) {
        const { radioWrapper, radio, radioInner, radioInput, radioTitle } = elements;

        this.el = radio;
        this.input = radioInput;

        return {
            el: radioWrapper,
            children: [{
                el: radio,
                children: [
                    {
                        el: radioInner
                    },
                    {
                        el: radioInput
                    }]
            }, {
                el: radioTitle
            }]
        }
    };

    bindEvents(elements: IRadioDOM) {
        const { radio, radioInput } = elements;
        const { checked } = this.config;

        if (checked) {
            radioInput.checked = checked;
            addClassName(radio, `${this.prefixClass}-checked`)
        }

        radio.addEventListener('change', e => {
            //@ts-ignore
            const checked = e.target?.checked;
            this.setStateClasses(radio, checked)
            eventEmitter.emit('radio:change', this.config, checked);
        })
    };

    setStateClasses(target: HTMLElement, checked: boolean) {
        const { prefixClass } = this;

        if (checked) {
            addClassName(target, getCheckedClass(prefixClass));
            return;
        }
        removeClassName(target, getCheckedClass(prefixClass))
    }

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDomTree(elements);
        return domTreeRender(domTree);
    }
}