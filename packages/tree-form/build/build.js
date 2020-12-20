#!usr/bin/env node
'use strict';

/**
 * @fileoverview 构建方法(esm、umd、cjs打包)
 */
const chalk = require('chalk');

const { version, dependencies = {}, peerDependencies = {} } = require("../package.json");

const makeExternalPredicate = externalArray => {
    if (!externalArray.length) {
        return () => false;
    }

    const REG_EXP = new RegExp(`^(${externalArray.join('|')})($|/)`);

    return id => REG_EXP.test(id);
};

const build = async () => {

    const external = makeExternalPredicate([...Object.keys(dependencies), ...Object.keys(peerDependencies)]);

    const entrance = 'src/index.ts';

    const globals = {};

    const info = { entrance, version, external, globals };

    try {
        await require('./umd')(info);
        await require('./cjs')(info);
        await require('./esm')(info);

        consola.success(`${chalk.cyanBright('Bulit successfully!')}`);
    }
    catch (error) {

        consola.error(error);

        process.exit(1);
    }
}

build()