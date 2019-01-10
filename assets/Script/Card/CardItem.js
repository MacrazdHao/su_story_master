/**
 * @author uu
 * @file 单个卡牌
 * @todo 限制当前玩家出牌
 */
cc.Class({
  extends: cc.Component,

  properties: {
    sprite: cc.Sprite,
    valueLabel: cc.Label,
    cardTitleLabel: cc.Label,
    contentLabel: cc.Label,
    cardIconAtlas:cc.SpriteAtlas,
  },
  init(UI, sprites, data) {
    this.UI = UI
    this.game = UI.game
    this.data = data
    this.sprite.spriteFrame = this.cardIconAtlas.getSpriteFrame(data.cardIcon);
    //this.sprite.spriteFrame = sprites[data.cardAtt]
    this.valueLabel.string = data.cardValue
    this.cardTitleLabel.string = data.name
    // this.contentLabel.string = data.content
  }, 
  onClick() {
    if (this.game.status == 0) {
      return
    }
    this.game.onPlayerChooseCard(this.data)
    this.UI.onCardOut(this.node, this.data)
  }
});