/**
 * @author uu
 * @file  卡牌
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    sprite: cc.Sprite,
    valueLabel: cc.Label,
    cardTitleLabel: cc.Label,
    contentLabel: cc.Label,
    cardIconAtlas: cc.SpriteAtlas,
    _index: 0,
    data: []
  },
  init(g, data) {
    this._game = g
    this.data = data
    // this.sprite.spriteFrame = this.cardIconAtlas.getSpriteFrame(data.cardIcon);
    this.valueLabel.string = data.cardValue
    this.cardTitleLabel.string = data.name || ''
    this.lateInit()
  },
  lateInit() {

  },
  chooseCard() {
    if (this._game.status == 0) {//|| this._game._curCardNum == 1 测试合成
      return
    }
    this._game.onPlayerChooseCard(this.data, this.node)
  },
});