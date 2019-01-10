/**
 * @author uu
 * @file  提示框组件
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    title: cc.Label,
    content: cc.Label,
  },
  init(dadNode, data, func) {
    this.node.parent = dadNode
    this.data = data
    this.confirmCallback = func
    this.lateInit()
  },
  lateInit() {
    this.node.x = 0
    this.node.y = 0
    this.node.active = true;
    this.title.string = this.data.title
    this.content.string = this.data.content
    this.node.runAction(cc.show())
  },

  onConcelButton() {
    this.node.runAction(cc.hide())
  },
  onConfirmButton() {
    this.onConcelButton();
    this.confirmCallback()
  }
});