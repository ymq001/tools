// import "babel-polyfill";
import { mixin } from './mixin';
import { tools } from './tools';
import { cookies } from './cookies';
import { protorypes } from './prototype';
import { socketLib } from './socket';
import { ajax } from './ajax';

/**
 * @class utils
 * @description 基础工具类集合 {@link http://172.26.1.40/docs/examples/utils.html|Utils示例}
 * @author codeD
 * @date 2018-11-02
 * @export utils
 * @mixes date
 * @mixes tools
 * @mixes cookies
 */
class utils extends mixin(tools, cookies, protorypes, socketLib) {
}

export { utils, ajax };