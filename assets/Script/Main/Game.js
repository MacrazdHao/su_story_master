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
    this.test = c.test;
    this.player = player
    this.level = level
    this.lateInit()
  },
  lateInit() {
    this.initUI()
    this.combatJudge.init(this);
  },

  initUI() {
    this.status = 1;
    this.onPlayerEnter();
    this.onAIEnter();
  },
  onPlayerEnter() {
    console.log("初始化玩家手里的卡牌", this.player.cards);
    this.recoveryUICards();
    this.curPlayerCardArr = [];
    this.player.cards.forEach(element => {
      this.instantiateCard(this, element, this.cardsContainer);
    });
  },
  /*-------AI入场，失败，退场---------*/
  onAIEnter() {
    this._aiMgr.onAIAnim(1);
    this._aiMgr.onAIText(1);
  },
  onAIFail() {
    this._aiMgr.onAIAnim(2);
    this._aiMgr.onAIText(2);
  },
  onAIWin() {
    this._aiMgr.onAIText(3);
    setInterval(() => {
      this.onGameOver()
    }, 1000)
  },

  onAIRunKill() {

  },
  onAICardWin() {
    this.scheduleOnce(() => {
      if (this.player.blood == 1) {
        this.onAIWin()

      } else {
        this._dataMgr.subPlayerBlood(1);
        this._dataMgr.subPlayerCard(this.curPlayerCardData);
        this.onNextTurning();
      }
      this.status = 1;
    }, 1)
  },
  /*----------Player-------------------- */
  judgeWinOrFail() {
    this.status = 2;
    this.scheduleOnce(() => {
      let skill = this._aiMgr.runSkill();
      let booleValue = this.combatJudge.checkWhoWin(this.playerCurCard, skill);
      if (booleValue.isWin) {
        console.log("玩家赢：");
        this.onPlayerCardWin(booleValue)
      } else {
        console.log("AI赢");
        this.onAICardWin(booleValue);
      }
    }, 1);
    console.log("巅峰对决：", this.level.monster, this.playerCurCard);
  },

  onPlayerCardWin(data) {
    this.resetCard();
    this.scheduleOnce(() => {
      if (this.level.monster.blood <= data.damage) {
        this.nextFight()
      } else {
        this._aiMgr.subBlood(1);
        this.onNextTurning();
      }
      this.status = 1;
    }, 1);
  },


  //升级 level + 1 blood + 1
  nextFight() {
    this._dataMgr.upgradePlayerLevel();
    this.resetCard();
    this.onAIEnter();
    console.log("下一个回合:", this.player);
  },

  onNextTurning() {
    this.resetCard();
    this.status = 1
  },

  onGameOver() {
    let func = () => {
      this._controller.init();
      this._controller.page.onOpenPage(2);
    };
    this._controller.dialog.init(
      "游戏结束了！",
      "you failed! QAQ",
      func,
      null
    );
    this.recoveryCenterCards();
  },
  /**
   * 玩家通过关卡升级操作
   * @author kunji
   */
  upgradePlayerLevel() {
    this.player.blood += 1;
    this.player.level += 1;
    this.saveData();
  },

  subPlayerBlood(num) {
    this.player.blood -= num;
    this.saveData();
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
  getKongfuNameById(id) {
    return this.KongfuData[id]
  },
});