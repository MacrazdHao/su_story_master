/**
 * @author uu
 * @file  应用主控制器
 * @description 在这里获得所有脚本组件
 */
cc.Class({
  extends: cc.Component,
  properties: {
    data: require('DataController'),
    audio: require('Audio'),
    page: require('Page'),
    dialog: require('Dialog'),
    rank: require('Rank'),
    game: require('Game'),
    referee: require('CombatJudgment'),
    AI: require('AI'),
    action: require('Action'),
    isWeChat: false,
  },
  init() {
    this.data.init(this);
    this.page.init(this);
  },
  start() {
    if (this.isWeChat) {
      this.rank.init(this)
    }
    this.init();
  },
  // ------------ 按钮绑定 --------------
  onStartButton() {
    this.game.init(this, this.data.initPlayerData(), this.data.initLevelData(1))
    
  }
});