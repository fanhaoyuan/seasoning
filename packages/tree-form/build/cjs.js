'use strict';

/**
 * @fileoverview cjsBundle打包方法
 */

const consola = require('consola');
const chalk = require('chalk');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const json = require('@rollup/plugin-json');
const rimraf = require('rimraf');

const childProcess = require('child_process');
const { rollup } = require('rollup');

module.exports = async info => {
    try {
        const { entrance, external,globals } = info;

        consola.info("Building for cjsBundle...")

        consola.info('Cleanup folder<lib> start');

        rimraf.sync('lib');

        consola.success('Cleanup folder<lib> successfully!');

        const cjsBundle = await rollup({
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

        await cjsBundle.write({
            file: 'lib/index.js',
            format: 'cjs',
            exports: 'named',
            globals
        })

        childProcess.exec('tsc -p ./tsconfig.cjs.json');

        childProcess.exec('lessc ./src/styles/index.less ./lib/tree-form.css')

        consola.success("Building for cjsBundle successfully!")
    }
    catch (error) {

        consola.error(chalk.red(`Building for cjsBundle error:${chalk.bgYellow(error)}`));

        throw new Error(error);
    }
}