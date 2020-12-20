'use strict';
import eventEmitter from '../eventEmitter';
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
import { ITreeNodeConfig } from '../types';

interface ICheckboxDOM {
    checkboxWrapper: HTMLLabelElement,
    checkbox: HTMLSpanElement,
    checkboxInner: HTMLSpanElement,
    checkboxInput: HTMLInputElement
};

const getCheckedClass = (prefixClass: string) => `${prefixClass}-checked`;

export default class Checkbox {
    config: ITreeNodeConfig;
    input!: HTMLElement;
    el!: HTMLElement;
    prefixClass: string = 'tree-form-checkbox';
    constructor(config: ITreeNodeConfig) {
        this.config = config;
        eventEmitter.on(`${this.config.key}:checked`, (checked: boolean) => {
            this.setStateClasses(this.el, checked)
            //@ts-ignore
            this.input.checked = checked;
        })
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

        this.input = checkboxInput;
        this.el = checkbox
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
        const { checkbox, checkboxInput } = elements;

        const { checked } = this.config;

        if (checked) {
            checkboxInput.checked = checked;
            this.setStateClasses(checkbox, checked)
        }

        checkbox.addEventListener('change', event => {
            //@ts-ignore
            const checked = event.target?.checked;
            this.config.checked = checked;
            this.setStateClasses(checkbox, checked);
            eventEmitter.emit('checkbox:change', this.config, checked);
        });
    };

    render(): HTMLElement {
        const elements = this.createDOM();
        this.bindEvents(elements);
        const domTree = this.createDomTree(elements);
        return domTreeRender(domTree);
    };

    setStateClasses(target: HTMLElement, checked: boolean) {
        const { prefixClass } = this;

        if (checked) {
            addClassName(target, getCheckedClass(prefixClass));
            return;
        }
        removeClassName(target, getCheckedClass(prefixClass))
    }
};