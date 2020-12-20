'use strict';

/**
 * @fileoverview umdBundle打包方法
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
const { terser } = require('rollup-plugin-terser');

module.exports = async info => {
    try {
        const { entrance, external, name, globals } = info;

        consola.info("Building for umdBundle...");

        consola.info('Cleanup folder<dist> start');

        rimraf.sync('dist');

        consola.success('Cleanup folder<dist> successfully!');

        const umdBundle = await rollup({
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
                terser()
            ],
            external
        })

        await umdBundle.write({
            name:'TreeForm',
            file: 'dist/index.js',
            format: 'umd',
            exports: 'default',
            globals
        })

        consola.success('Building for umdBundle successfully!');
    }
    catch (error) {

        consola.error(chalk.red(`Building for umdBundle error:${chalk.bgYellow(error)}`));

        throw new Error(error);
    }
}