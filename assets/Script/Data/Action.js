/**
 * @author uu
 * @file  简单动作数据
 * @todo 
 */

/*----AI------*/
let action = {
    onAIfade (node) {
        node.stopAllAction();
        let show = cc.fadeIn(1.0);
        let hide = cc.fadeOut(0);
        let dealyTime = cc.delayTime(2);
        let rep = cc.repeat(cc.sequence(show, dealyTime ,hide), 1);
        node.runAction(rep);
    } 
}
module.exports = action;
