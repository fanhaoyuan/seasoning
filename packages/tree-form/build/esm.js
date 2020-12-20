'use strict';

/**
 * @fileoverview esmBundle打包方法
 */

const consola = require('consola');
const chalk = require('chalk');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const json = require('@rollup/plugin-json');
const rimraf = require('rimraf');

const { rollup } = require('rollup');

module.exports = async info => {
    try {

        const { entrance, external, globals } = info;

        consola.info("Building for esmBundle...");

        consola.info('Cleanup folder<esm> start');

        rimraf.sync('esm');

        consola.success('Cleanup folder<esm> successfully!');

        const esmBundle = await rollup({
            input: entrance,
            plugins: [
                nodeResolve(),
                typescript({
                    tsconfigOverride: {
                        compilerOptions: {
                            emitDeclarationOnly: false,
                            declaration: false // 不生成声明文件(*.d.ts)
                        },
                    },
                }),
                babel({
                    runtimeHelpers: true,
                    extensions: ['.js', '.ts'],
                    exclude: 'node_modules/**'
                }),
                commonjs(),
                json(),
            ],
            external
        })

        await esmBundle.write({
            file: 'esm/index.js',
            format: 'esm',
            globals
        })

        consola.success("Building for emsBundle successfully!")
    }
    catch (error) {

        consola.error(chalk.red(`Building for emsBundle error:${chalk.bgYellow(error)}`));

        throw new Error(error);
    }
}