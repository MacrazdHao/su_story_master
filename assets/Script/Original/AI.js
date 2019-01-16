/**
 * @author uu
 * @file  AI处理
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    _startBlood: 0,

  },
  start() {

  },
  init(data, g) {
    this._game = g
    this.data = data
    this.lateInit()
  },
  lateInit() {
    this._startBlood = this.data.blood;
    this.monsterAnim = this.node.getComponent(cc.DragonBones);
  },
  runSkill(data) {
    let blood = data.blood;
    if (blood == (this._startBlood) * 0.8) { //skill0

    } else if (blood > (this._startBlood) * 0.5) { //skill3

    } else if (blood < (this._startBlood) * 0.5 && blood > (this._startBlood) * 0.2) { //skill2

    } else if (blood < (this._startBlood) * 0.25) { //skill1

    }
  },

  runStatus(type) {

  },
  // 1 2 3 start win fail
  onAIAnim (type) {
   let anim = this.node.addComponent('dragonBones');
   anim.dragonAltas = '';
   anim.dragonAsset = '';

  },
});