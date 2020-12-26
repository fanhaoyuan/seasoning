'use strict';

import eventEmitter, { EventEmitter } from '../eventEmitter';
import { ITreeNodeConfig, IOptions } from '../types';
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
import { createElement, addClassName, domTreeRender, removeClassName, uuid } from '../utils';

const getCheckedClass = (prefixClass: string) => `${prefixClass}-checked`;

export interface IRadioSetting {
    inGroup?: boolean;
    key: string;
    label: string;
}

export default class Radio extends EventEmitter {
    privateKey: string = uuid();
    config: ITreeNodeConfig;
    setting: IRadioSetting;
    input!: HTMLElement;
    el!: HTMLElement;
    prefixClass: string = 'tree-form-radio';
    constructor(config: ITreeNodeConfig, setting?: IRadioSetting) {
        super();
        this.config = config;
        this.setting = this.getSetting(setting);
        this.init();
    };

    init() {
        const {
            config,
            config: {
                key,
                group
            },
            setting: {
                inGroup
            }
        } = this;

        eventEmitter.once(`${key}:destroy`, () => this.destroy(config));

        /**不是group */
        if (!group) {
            this.bindNormalEvents();
            return;
        }

        /**是group 但不是option节点 */
        if (!inGroup) {
            this.bindGroupEvents();
            return;
        }

        this.bindOptionEvents();

    };

    getSetting(setting: Partial<IRadioSetting> = {}): IRadioSetting {
        const defaultSetting: IRadioSetting = {
            inGroup: false,
            key: uuid(),
            label: ''
        };

        return Object.assign({}, defaultSetting, setting);
    };

    destroy(config: ITreeNodeConfig) {
        const { key } = config;
        eventEmitter.off(`${key}:checked`);
    }

    bindNormalEvents() {
        eventEmitter.on(`${this.config.key}:checked`, (checked: boolean) => {
            // console.log('radio', checked)
            this.setStateClasses(this.el, checked)
            //@ts-ignore
            this.input.checked = checked;
        })
    };
    bindGroupEvents() {
        const { config: { key } } = this;

        eventEmitter.on(`${key}-option:change`, (option: IOptions, checked: boolean) => {

            eventEmitter.emit(`${key}:checked`, option.key, checked)
        });
    };
    bindOptionEvents() {
        const { privateKey, config: { key }, setting: { key: optionKey } } = this;
        eventEmitter.on(`${key}:checked`, (checkedKey: string, checked: boolean) => {

            if (checked) this.config.checkedKeys = [checkedKey];

            if (checkedKey !== optionKey) {
                //@ts-ignore
                this.input.checked = false;
                this.emit(`${privateKey}:change`, false);
            }
        })
    };

    createWrapper() {
        const { prefixClass } = this;
        return createElement('label', {
            className: `${prefixClass}-wrapper`
        });
    };

    createRadio() {
        const {
            prefixClass,
            privateKey,
            config: {
                checked = false,
                checkedKeys = []
            },
            setting: {
                inGroup = false,
                key
            }
        } = this;

        const classList = [`${prefixClass}`];

        if (checked) classList.push(getCheckedClass(prefixClass));
        if (inGroup && checkedKeys.includes(key)) classList.push(getCheckedClass(prefixClass));

        const radio = createElement('span', {
            className: classList.join(' '),
        });

        radio.addEventListener('change', event => {
            //@ts-ignore
            const checked = event.target?.checked;
            this.setStateClasses(radio, checked);
        });

        this.on(`${privateKey}:change`, (checked: boolean) => this.setStateClasses(radio, checked));

        return radio;
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
                checked = false,
                group = false,
                checkedKeys = []
            },
            setting: {
                inGroup = false,
                key
            }
        } = this;
        const input = createElement('input', {
            type: 'radio',
            className: `${prefixClass}-input`,
            checked: !group ? checked : inGroup ? checkedKeys.includes(key) : false
        });

        input.addEventListener('change', (event) => {
            const { config, config: { key, group }, privateKey, setting, setting: { inGroup } } = this;
            //@ts-ignore
            const checked = event.target?.checked;

            this.emit(`${privateKey}:change`, checked);

            if (!group) {
                eventEmitter.emit('radio:change', config, checked);
                return;
            }

            if (!inGroup) {
                return;
            }

            eventEmitter.emit(`${key}-option:change`, setting, checked);
        });

        return input;
    };

    createTitle() {
        const {
            config: {
                title
            },
            setting: {
                inGroup,
                label,
            }
        } = this;

        return createElement('span', {
            innerText: inGroup ? label : title
        });
    }

    createGroup() {
        const { prefixClass } = this;
        return createElement('div', {
            className: `${prefixClass}-group`
        });
    }

    createGroupDOM() {
        const {
            config,
            config: {
                options = []
            }
        } = this;
        const createGroup = this.createGroup();

        return {
            el: createGroup,
            children: options.map(option => {
                return {
                    el: new Radio(config, { ...option, inGroup: true }).render()
                }
            })
        }
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
        const { setting: {
            inGroup = false
        } } = this;
        const { group = false } = this.config;

        const targetDOM = group && !inGroup ? this.createGroupDOM() : this.createDOM();

        return domTreeRender(targetDOM);
    }
}