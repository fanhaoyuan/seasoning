'use strict';
/**
 * @fileoverview 生成checkbox DOM
 * @example
 *
 * <label class=`${prefixClass}-wrapper`>
 *      <span class=`${prefixClass}`>
 *          <span class=`${prefixClass}-inner`></span>
 *          <input class=`${prefixClass}-input`></input>
 *      </span>
 * </label>
 */
import { createElement, addClassName, removeClassName, domTreeRender } from '../utils';
import eventEmitter from '../eventEmitter';

interface ICheckboxConfig {
    prefixClass: string;
    checkedClass: string;
};

interface ICheckboxDOM {
    checkboxWrapper: HTMLLabelElement,
    checkbox: HTMLSpanElement,
    checkboxInner: HTMLSpanElement,
    checkboxInput: HTMLInputElement
};

export default class Checkbox {
    prefixClass: string = 'tree-form-checkbox';
    };

    createDOM(): ICheckboxDOM {
        const { prefixClass } = this;

        const checkboxWrapper = createElement('label', {
            className: `${prefixClass}-wrapper`
        });
        const checkbox = createElement('span', {
            className: `${prefixClass}`
        });
        const checkboxInner = createElement('span', {
            className: `${prefixClass}-inner`
        });
        const checkboxInput = createElement('input', {
            type: 'checkbox',
            className: `${prefixClass}-input`
        });

        return { checkboxWrapper, checkbox, checkboxInner, checkboxInput };
    };

    createDomTree(elements: ICheckboxDOM) {
        const { checkboxWrapper, checkbox, checkboxInner, checkboxInput } = elements;

        return {
            el: checkboxWrapper,
            children: [{
                el: checkbox,
                children: [
                    {
                        el: checkboxInner
                    },
                    {
                        el: checkboxInput
                    }]
            }]
        }
    };

    bindEvents(elements: ICheckboxDOM) {
        const { checkedClass } = this.config;
        const { checkbox } = elements;
        checkbox.addEventListener('change', e => {
            console.log(e)
            eventEmitter.emit('checkbox:onchange', e)
            //@ts-ignore
            const checked = e.target?.checked;
            if (checked) {
                addClassName(checkbox, checkedClass);
                return;
            }
            removeClassName(checkbox, checkedClass)
        })
    };

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDomTree(elements);
        return domTreeRender(domTree);
    };
        const { prefixClass } = this;
};