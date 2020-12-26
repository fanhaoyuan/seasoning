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

'use strict';
import eventEmitter, { EventEmitter } from '../eventEmitter';
import { createElement, addClassName, removeClassName, domTreeRender, uuid } from '../utils';
import { ITreeNodeConfig } from '../types';

export interface ICheckboxSetting {
    inGroup?: boolean;
    key: string;
    label: string;
};

const getCheckedClass = (prefixClass: string) => `${prefixClass}-checked`;

export default class Checkbox extends EventEmitter {
    privateKey: string = uuid();
    config: ITreeNodeConfig;
    setting: ICheckboxSetting;
    input!: HTMLElement;
    el!: HTMLElement;
    prefixClass: string = 'tree-form-checkbox';
    constructor(config: ITreeNodeConfig, setting?: Partial<ICheckboxSetting>) {
        super();
        this.config = config;
        this.setting = this.getSetting(setting);
        this.init();
    };

    init() {
        const { config, config: { key } } = this;
        eventEmitter.once(`${key}:destroy`, () => this.destroy.call(this, config));

        eventEmitter.on(`${key}:checked`, (checked: boolean) => {
            this.setStateClasses(this.el, checked)
            //@ts-ignore
            this.input.checked = checked;
        });
    }

    destroy(config: ITreeNodeConfig) {
        const { key } = config;
        eventEmitter.off(`${key}:checked`);
        this.off();
    }

    getSetting(setting: Partial<ICheckboxSetting> = {}): ICheckboxSetting {
        const defaultSetting: ICheckboxSetting = {
            inGroup: false,
            key: uuid(),
            label: ''
        };

        return Object.assign({}, defaultSetting, setting);
    };

    createWrapper() {
        const { prefixClass } = this;

        return createElement('label', {
            className: `${prefixClass}-wrapper`
        });

    };

    createCheckbox() {
        const {
            prefixClass,
            config: {
                checked = false
            }
        } = this;

        const classList = [`${prefixClass}`];

        if (checked) classList.push(getCheckedClass(prefixClass));

        const checkbox = createElement('span', {
            className: classList.join(" ")
        });

        checkbox.addEventListener('change', (event) => {
            //@ts-ignore
            const checked: boolean = event.target.checked;

            this.setStateClasses(checkbox, checked);
        });

        return checkbox;
    };

    createInner() {
        const { prefixClass } = this;
        return createElement('span', {
            className: `${prefixClass}-inner`
        });
    };

    createInput() {
        const {
            prefixClass,
            config: {
                checked = false
            }
        } = this;

        const input = createElement('input', {
            type: 'checkbox',
            className: `${prefixClass}-input`,
            checked
        });

        input.addEventListener('change', (event) => {
            const { config, config: { key }, setting: { inGroup, key: privateKey } } = this;
            //@ts-ignore
            const checked: boolean = event?.target?.checked;
            this.config.checked = checked;

            eventEmitter.emit('checkbox:change', config, checked);
        });

        return input;
    };

    createTitle() {
        const {
            config: {
                title
            }
        } = this;

        return createElement('span', {
            innerText: title
        });
    };

    createDOM() {
        const checkboxWrapper = this.createWrapper();
        const checkbox = this.createCheckbox();
        const checkboxInner = this.createInner();
        const checkboxInput = this.createInput();
        const checkboxTitle = this.createTitle();

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
            }, {
                el: checkboxTitle
            }]
        }
    };

    render(): HTMLElement {
        return domTreeRender(this.createDOM());
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