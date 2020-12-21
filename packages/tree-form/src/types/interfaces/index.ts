'use strict';

export interface IConfig {
    /**可嵌套的节点属性的数组，生成 tree 的数据 */
    data: ITreeNodeConfig[];
    prefixClass?: string;
    container: string | HTMLElement;
    onSelectChange?(): [];
    onCheckboxChange?(): [];
    onToggleExpand?(): [];
}

export interface ITreeConfig {
    prefixClass?: string;
    /**可嵌套的节点属性的数组，生成 tree 的数据 */
    data: ITreeNodeConfig[];

    treeData: ITreeNodeConfig[];

    defaultExpandedKeys: string[];

    defaultSelectedKeys: string[];

    onCheck?(checkedKeys: string[]): void;

    onExpand?(expandedKeys: string[]): void;
};

export interface ITreeNodeConfig {
    /**节点的唯一标识 */
    key: string;
    /**标题 */
    title: string;

    expand?: boolean;
    /**禁掉响应 默认false*/
    disabled?: boolean;
    /**禁掉 checkbox 默认false*/
    disableCheckbox?: boolean;
    /**子节点属性数组 */
    children?: ITreeNodeConfig[];

    checked?: boolean;
    value?: string;
    nodeType?: NodeType;
    inputOptions: {
        suffix: string;
        prefix: string;
        style: {
            [x in keyof CSSStyleDeclaration]: string | number;
        }
    }
};

export type NodeType = 'checkbox' | 'radio' | 'text' | 'input'

export interface ITreeData {
    title?: string;
    key: string;
    children?: ITreeData[]
}

export interface INullElement {
    el: null;
    shouldRender: false;
}