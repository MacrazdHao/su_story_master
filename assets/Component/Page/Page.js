/**
 * @author uu
 * @file  页面控制器和适配
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    status: 0, //页面状态
    pages: [],
  },
  init() {

  },
  lateInit() {
    this.width = cc.director.getVisibleSize().width
    this.height = cc.director.getVisibleSize().height
    // 存为全局变量
    this.adoptCanvas()
  },
  adoptCanvas() {
    // 适配解决方案
    let canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas)
    // 设计分辨率比
    let rateR =  canvas.designResolution.height/canvas.designResolution.width;
    // 显示分辨率比
    let rateV = this.height / this.width;
    console.log("winSize: rateR: " + rateR + " rateV: " + rateV);
    if (rateV > rateR) {
      canvas.fitHeight = false;
      canvas.fitWidth = true;
      console.log("winSize: fitWidth");
    } else {
      canvas.fitHeight = true;
      canvas.fitWidth = false;
      console.log("winSize: fitHeight");
    }
  }
});