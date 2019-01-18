/**
 * @author uu
 * @file  AI处理
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    _startBlood: 0,
    opacity: 255,
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
    this.monsterText = this.node.getChildByName('AIText');
    this.monsterAnim = this.node.getChildByName('AIAnim').getComponent(dragonBones.ArmatureDisplay);
  },
  runSkill(data) {
    let blood = data.blood;
    if (blood == (this._startBlood) * 0.8) { //skill0

    } else if (blood > (this._startBlood) * 0.5) { //skill3

    } else if (blood < (this._startBlood) * 0.5 && blood > (this._startBlood) * 0.25) { //skill2

    } else if (blood < (this._startBlood) * 0.25) { //skill1

    }
  },

  runStatus(type) {

  },
  // 1 2 3 start win fail
  onAIAnim(type) {
    if (type == 1)
      this.monsterAnim.playAnimation('start', 1);
    else if (type == 2)
      this.monsterAnim.playAnimation('fail', 1);
    else if (type == 3)
      this.monsterAnim.playAnimation('stay', -1);
  },

  onAIText(type) {
    this.monsterText.getComponent(cc.Label).string = this.data["text" + type];
    let show = cc.fadeIn(1.0);
    this.monsterText.runAction(show);
    this.scheduleOnce(() => {
      let hide = cc.fadeOut(0);
      let dealyTime = cc.delayTime(2);
      let seq = cc.sequence(dealyTime, hide);
      this.monsterText.runAction(seq);
    }, 1)
  },
});