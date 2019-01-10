/**
 * @author uu
 * @file  处理和判断谁的卡牌获胜和返回伤害
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {},
  init(g) {
    this._game = g
  },
  lateInit() {

  },
  checkWhoWin(cardData, AIData) {
    // 比较哪张卡牌厉害
    if ((cardData.cardAtt != 0 && cardData.cardAtt > AIData.cardAtt) || (cardData.cardAtt == 0 && AIData.cardAtt == 2)) {
      return true
    } else {
      return false
    }
  },
  showResult () {
    
  },
});