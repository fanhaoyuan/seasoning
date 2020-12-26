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
import { IOptions, ITreeNodeConfig } from '../types';

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
        const { config, privateKey, config: { key, group }, setting: { inGroup } } = this;
        eventEmitter.once(`${key}:destroy`, () => this.destroy.call(this, config));

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

    bindNormalEvents() {
        const { config: { key } } = this;

        eventEmitter.on(`${key}:checked`, (checked: boolean) => {
            this.setStateClasses(this.el, checked)
            //@ts-ignore
            this.input.checked = checked;
        });
    };

    bindGroupEvents() {
        const { config: { key } } = this;

        eventEmitter.on(`${key}-option:change`, (option: IOptions, checked: boolean) => {

            eventEmitter.emit(`${key}:checked`, option.key, checked)
        });
    }

    bindOptionEvents() {
        const { config: { key }, setting: { key: optionKey } } = this;
        eventEmitter.on(`${key}:checked`, (checkedKey: string, checked: boolean) => {
            if (checkedKey === optionKey) {
                if (checked) {
                    //@ts-ignore
                    this.config.checkedKeys = [...this.config.checkedKeys, checkedKey]
                }
                else {
                    //@ts-ignore
                    this.config.checkedKeys = this.config.checkedKeys.filter(v => v !== checkedKey);
                }
            }
        })
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
            privateKey,
            config: {
                checked = false,
                checkedKeys = []
            },
            setting: {
                key,
                inGroup = false
            }
        } = this;

        const classList = [`${prefixClass}`];

        if (checked) classList.push(getCheckedClass(prefixClass));
        if (inGroup && checkedKeys.includes(key)) classList.push(getCheckedClass(prefixClass));

        const checkbox = createElement('span', {
            className: classList.join(" ")
        });

        this.on(`${privateKey}:change`, (checked: boolean) => this.setStateClasses(checkbox, checked));

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
                checked = false,
                group,
                checkedKeys = []
            },
            setting: {
                inGroup = false,
                key
            }
        } = this;

        const input = createElement('input', {
            type: 'checkbox',
            className: `${prefixClass}-input`,
            checked: !group ? checked : inGroup ? checkedKeys.includes(key) : false
        });

        input.addEventListener('change', (event) => {
            const { config, config: { key, group }, privateKey, setting, setting: { inGroup } } = this;
            //@ts-ignore
            const checked: boolean = event?.target?.checked;
            this.config.checked = checked;

            this.emit(`${privateKey}:change`, checked);

            if (!group) {
                eventEmitter.emit('checkbox:change', config, checked);
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
    };

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
                    el: new Checkbox(config, { ...option, inGroup: true }).render()
                }
            })
        }
    }

    createDOM() {
        const checkboxWrapper = this.createWrapper();
        const checkbox = this.createCheckbox();
        const checkboxInner = this.createInner();
        const checkboxInput = this.createInput();
        const checkboxTitle = this.createTitle();

        this.input = checkboxInput;
        this.el = checkbox;
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
        const { setting: {
            inGroup = false
        } } = this;
        const { group = false } = this.config;

        const targetDOM = group && !inGroup ? this.createGroupDOM() : this.createDOM();

        return domTreeRender(targetDOM);
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