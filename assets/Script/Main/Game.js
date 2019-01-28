/**
 * @author uu
 * @file  游戏流程主控制器 以及当前游戏数据管理
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    status: 0,
    // 战斗状态
    // 0:未知状态/未初始化状态/不可操作状态
    // 1:只有在1下才是可自由操作卡牌状态
    // 2:裁判判断阶段/动画阶段/不可操作状态
    UI: require('UI'),
    Cards: require('Cards')
  },
  // ------------ 关卡初始化 -----------------------
  init(c, player, level) {
    this._controller = c;
    this._dataMgr = c.data;
    this.combatJudge = c.referee;
    this.dialog = c.dialog;
    this.page = c.page
    this.action = c.action;
    this._aiMgr = c.AI
    this.player = player
    this.level = level
    this.lateInit()
  },
  lateInit() {
    this.Cards.init(this)
    this.combatJudge.init(this);
    this.initUI()
  },

  initUI() {
    this.status = 1;
    this.Cards.loadPlayerCard()
    this._aiMgr.onAIEnter();
  },
  /*------- 卡牌输赢 ---------*/
  judgeWinOrFail(data) {
    this.status = 2;
    this.scheduleOnce(() => {
      let skill = this._dataMgr.getSkillById(this._aiMgr.runSkill())
      let booleValue = this.combatJudge.checkWhoWin(data, skill)
      booleValue.isWin ? this.onPlayerCardWin(booleValue) : this.onAICardWin(booleValue)
    }, 1);
  },
  onAICardWin(data) {
    this.scheduleOnce(() => {
      if (this.player.blood <= data.damage) {
        this._aiMgr.onAIWin()
        setTimeout(() => {
          this.onGameOver()
        }, 1000)
      } else {
        this.subPlayerBlood(data.damage);
        this.onNextTurning();
      }
      this.status = 1;
    }, 1)
  },
  onPlayerCardWin(data) {
    this.Cards.resetCard();
    this.scheduleOnce(() => {
      if (this.level.monster.blood <= data.damage) {
        this._aiMgr.onAIFail()
        this.nextFight()
      } else {
        this._aiMgr.subBlood(data.damage);
        this.onNextTurning();
      }
      this.status = 1;
    }, 1);
  },

  /*----------回合控制-------------------- */
  nextFight() {
    this.upgradePlayerLevel();
    this.level = this._dataMgr.initLevelData(this.player.level + 1)
    this.Cards.resetCard();
    this._aiMgr.onAIEnter();
    this.status = 1
    console.log("下一个回合:", this.player);
  },

  onNextTurning() {
    this.Cards.resetCard();
    this.status = 1
  },

  onGameOver() {
    let func = () => {
      this._controller.init();
      this.page.onOpenPage(2);
    };
    this._controller.dialog.init(
      "游戏结束了！",
      "you failed! QAQ",
      func,
      null
    );
  },

  /**
   * 玩家通过关卡升级操作
   * @author kunji
   */
  upgradePlayerLevel() {
    this.player.blood += 1;
    this.player.level += 1;
    this.UI.freshenPlayerBlood()
  },

  subPlayerBlood(num) {
    this.player.blood -= num;
    this.UI.subPlayerBlood(num)
  },

  subPlayerCard(data) {
    let cardArr = this.player.cards;
    for (let i = 0; i < cardArr.length; i++) {
      for (let j in data) {
        if (cardArr[i] == data[j])
          cardArr.splice(i, 1);
      }
    }
    console.log('玩家剩余卡牌:', cardArr)
  },

});