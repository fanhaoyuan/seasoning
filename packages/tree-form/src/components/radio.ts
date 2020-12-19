'use strict';

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
import { createElement, addClassName, domTreeRender } from '../utils';

interface IRadioConfg {
    prefixClass: string;
    checkedClass: string;
};

interface IRadioDOM {
    radioWrapper: HTMLLabelElement,
    radio: HTMLSpanElement,
    radioInner: HTMLSpanElement,
    radioInput: HTMLInputElement
}

export default class Radio {
    config: IRadioConfg;
    constructor(config: Partial<IRadioConfg> = {}) {
        this.config = Object.assign(this.getDefaultConfig(), config);
    };

    getDefaultConfig(): IRadioConfg {
        const prefixClass = 'tree-form-radio';

        return {
            prefixClass,
            checkedClass: `${prefixClass}-checked`
        }
    };

    createDOM(): IRadioDOM {
        const { prefixClass } = this.config;

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

        return { radioWrapper, radio, radioInner, radioInput };
    };

    createDomTree(elements: IRadioDOM) {
        const { radioWrapper, radio, radioInner, radioInput } = elements;

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
            }]
        }
    };

    bindEvents(elements: IRadioDOM) {
        const { checkedClass } = this.config;
        const { radio } = elements;
        radio.addEventListener('change', e => {
            console.log(e)
            //@ts-ignore
            const checked = e.target?.checked;
            if (checked) addClassName(radio, checkedClass);
            this.onChange(e)
        })
    };

    onChange(e: Event) {

    }

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDomTree(elements);
        return domTreeRender(domTree);
    }
}