'use strict';

import eventEmitter, { EventEmitter } from '../eventEmitter';
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

export default class Radio extends EventEmitter {
    config: ITreeNodeConfig;
    input!: HTMLElement;
    el!: HTMLElement;
    prefixClass: string = 'tree-form-radio';
    constructor(config: ITreeNodeConfig) {
        super();
        this.config = config;
        this.init();
    };

    init() {
        const {
            config,
            config: {
                key
            }
        } = this;

        eventEmitter.once(`${key}:destroy`, () => this.destroy(config));
        eventEmitter.on(`${this.config.key}:checked`, (checked: boolean) => {
            // console.log('radio', checked)
            this.setStateClasses(this.el, checked)
            //@ts-ignore
            this.input.checked = checked;
        })
    };

    destroy(config: ITreeNodeConfig) {
        const { key } = config;
        eventEmitter.off(`${key}:checked`);
    }

    createWrapper() {
        const { prefixClass } = this;
        return createElement('label', {
            className: `${prefixClass}-wrapper`
        });
    };

    createRadio() {
        const {
            prefixClass,
            config: {
                checked = false
            }
        } = this;

        const classList = [`${prefixClass}`];

        if (checked) classList.push(getCheckedClass(prefixClass));

        const radio = createElement('span', {
            className: classList.join(' '),
        });

        radio.addEventListener('change', event => {
            //@ts-ignore
            const checked = event.target?.checked;
            this.setStateClasses(radio, checked);
        });


        return radio;
    };

    createInner() {
        const { prefixClass } = this;
        return createElement('span', {
            className: `${prefixClass}-inner`
        });
    };

    createInput() {
        const { prefixClass, config } = this;
        const input = createElement('input', {
            type: 'radio',
            className: `${prefixClass}-input`
        });

        input.addEventListener('change', (event) => {
            //@ts-ignore
            const checked = event.target?.checked;
            eventEmitter.emit('radio:change', config, checked);
        });

        return input;
    };

    createTitle() {
        const { title } = this.config;

        return createElement('span', {
            innerText: title
        });
    }



    createDOM() {
        const radioWrapper = this.createWrapper();
        const radio = this.createRadio();
        const radioInner = this.createInner();
        const radioInput = this.createInput();
        const radioTitle = this.createTitle();

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

    setStateClasses(target: HTMLElement, checked: boolean) {
        const { prefixClass } = this;

        if (checked) {
            addClassName(target, getCheckedClass(prefixClass));
            return;
        }
        removeClassName(target, getCheckedClass(prefixClass))
    }

    render(): HTMLElement {
        return domTreeRender(this.createDOM());
    }
}