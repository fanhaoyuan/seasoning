'use strict';

import { ElementController } from "../../controllers";
import { InputType } from '../constants';

export interface IConfig {
    /**数据 */
    data?: IData;
    /**元素控制器 */
    elementController?: ElementController;
    /**输入框类名 */
    inputClassName: string;
    /**单选框类名 */
    radioClassName: string;
    /**复选框类名 */
    checkboxClassName: string;
    /**文字类名 */
    textClassName: string;
}

export interface IData {
    /**节点key值，唯一标识 */
    key: string;
    /**节点类型 */
    type: InputType;
    /**子节点元素 */
    children: IData[]
    /**是否为叶子节点 */
    leaf: boolean;
}