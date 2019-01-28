cc.Class({
  extends: cc.Component,

  properties: {
    bar:cc.ProgressBar,
  },
  init(total, current) {
    this.total = total || 1
    this.current = current || 1
    this.freshenNode(current);
  },
  start() {
    this.total = 1
    this.current = 1
    this.label = this.node.getChildByName('label').getComponent(cc.Label)
  },

  freshenNode(cur) {
    this.current = cur;
    this.label.string = this.current + '/' + this.total
   // this.blood.scaleX = this.current / this.total
    this.bar.progress = this.current / this.total;
  }
});