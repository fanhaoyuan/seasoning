'use strict';

import Tree from "../tree";

export default class ElementController {

    tree: Tree;
    constructor(tree: Tree) {
        this.tree = tree;
    };

    createInputNode(): HTMLInputElement {
        const inputNode = document.createElement('input');

        return inputNode;
    };

    createRadioNode(): HTMLInputElement {
        const radioNode = document.createElement('input');

        return radioNode;
    };

    createCheckboxNode(): HTMLInputElement {
        const checkboxNode = document.createElement('input');

        return checkboxNode;
    }
};