/**
 * @author uu
 * @file  游戏流程主控制器
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    status: 0,
    // 战斗状态
    // 0:未知状态/未初始化状态/不可操作状态
    // 1:只有在1下才是可自由操作卡牌状态
    // 2:裁判判断阶段/动画阶段/不可操作状态
  },
  init(c) {
    this._controller = c
  },
  lateInit() {
    
  }
});