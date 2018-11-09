// import "babel-polyfill";
import { mixin } from './mixin';
import { tools } from './tools';
import { cookies } from './cookies';
import { protorypes } from './prototype';
// import { socket } from './socket';

/**
 * @description 基础工具类集合
 * @author codeD
 * @date 2018-11-02
 * @export utils
 * @mixes date
 * @mixes tools
 * @mixes cookies
 */
export class utils extends mixin(tools, cookies, protorypes) {
}