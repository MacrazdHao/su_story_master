/**
 * @author uu
 * @file  简单动作数据
 * @todo 
 */
cc.Class({
    extends: cc.Component,
  
    properties: {},
    init(game) {
      this.game = game
    },
    onAIEnter() {
      let ai = this.game.curAI;
      ai.setPosition(0, 500)
      ai.scale = 0.2
      let action = cc.spawn(cc.moveBy(0.5, 0, -236), cc.rotateBy(0.5, 720))
      let action1 = cc.sequence(action, cc.scaleTo(0.5, 1, 1), this.slimAction())
      ai.runAction(action1)
    },
    onAIOut() {
      let ai = this.game.curAI;
      let action = cc.spawn(cc.moveBy(0.5, 0, 236), cc.rotateBy(0.5, -720), cc.scaleTo(0.5, 0, 0))
      ai.runAction(action)
    },
    getCardFromAI() {
      let action1 = cc.spawn(cc.scaleTo(0.5, 1), cc.moveBy(0.5, 0, -200))
      let action2 = cc.spawn(cc.scaleTo(0.5, 0), cc.moveBy(0.5, 0, -200))
      let action = cc.sequence(action1, cc.delayTime(0.5), action2)
      return action
    },
    slimAction() {
      // 上下蠕动的动画
      let ai = this.game.UI.AI.sprite.node
      let action1 = cc.sequence(cc.scaleTo(1, 0.9, 1.1), cc.scaleTo(1, 1.05, 0.95))
      let action = cc.repeatForever(action1)
      ai.runAction(action)
    },
    playerOutCard(target) {
      target.setPosition(-220, -0)
      let action1 = cc.moveBy(0.8, 0, 110)
      target.runAction(action1)
    },
    AIoutCard(target) {
      target.setPosition(80, 200)
      let action1 = cc.moveBy(0.8, 0, -105)
      target.runAction(action1)
    },
    onPlayerCardWin() {
    //   let playerCard = this.game.currentPlayerCard
    //   let AICard = this.game.currentAICard
    //   let action1 = cc.sequence(cc.moveBy(0.4, 100, 0), cc.moveBy(0.4, -100, 0))
    //   let action2 = cc.sequence(cc.moveBy(0.4, -100, 0), cc.spawn(cc.moveBy(0.4, 300, 100), cc.scaleTo(0.4, 0, 0), cc.rotateBy(0.4, 720)))
    //   playerCard.runAction(action1)
    //   AICard.runAction(action2)
      this.game.currentPlayerCard.parent = this.game.cardsContainer;
      this.game.currentAICard.parent = this.game.cardsContainer;
    },
    onAICardWin() {
      let playerCard = this.game.currentPlayerCard
      let AICard = this.game.currentAICard
      let action1 = cc.sequence(cc.moveBy(0.4, -100, 0), cc.moveBy(0.4,  100, 0))
      let action2 = cc.sequence(cc.moveBy(0.4,  100, 0), cc.spawn(cc.moveBy(0.4, -300, -100), cc.scaleTo(0.4, 0, 0), cc.rotateBy(0.4, -720)))
      playerCard.runAction(action2)
      AICard.runAction(action1)
    }
  });
