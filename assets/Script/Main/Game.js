/**
 * @author uu
 * @file  游戏流程主控制器
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    status: 0,
    cardsContainer: cc.Node,
    selectCardContainer: cc.Node,
    cardPrefab: cc.Prefab,
    curPlayerCard: [], //选中的卡牌
    curPlayerCardData: [], //当前卡牌的属性
    _curCardNum: 0,
    aiCard: cc.Node,
    UI:require('UI'),
    // 战斗状态
    // 0:未知状态/未初始化状态/不可操作状态
    // 1:只有在1下才是可自由操作卡牌状态
    // 2:裁判判断阶段/动画阶段/不可操作状态
  },
  start() {
    this.createPools();
  },
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

  createPools() {
    this.cardsPool = new cc.NodePool()
    let initCount = 10
    for (let i = 0; i < initCount; i++) {
      let card = cc.instantiate(this.cardPrefab)
      this.cardsPool.put(card)
    }
  },

  instantiateCard(self, data, parent) {
    let card = null
    if (self.cardsPool && self.cardsPool.size() > 0) {
      card = self.cardsPool.get()
    } else {
      card = cc.instantiate(self.cardPrefab)
    }
    card.parent = parent
    card.scale = 1
    card.x = 0
    card.y = 0
    card.getComponent('Card').init(self, data)
  },

  onPlayerEnter() {
    console.log("初始化玩家手里的卡牌", this.player.cards);
    this.recoveryUICards();
    this.curPlayerCardArr = [];
    this.player.cards.forEach(element => {
      this.instantiateCard(this, element, this.cardsContainer);
    });
  },

  recoveryUICards() {
    let childrens = this.cardsContainer.children
    if (childrens.length != 0) {
      let length = childrens.length;
      for (let i = 0; i < length; i++) {
        this.cardsPool.put(childrens[i])
      }
    }
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
  /*-------AI入场，失败，退场---------*/

  /*----------Player-------------------- */
  onPlayerChooseCard(data, node) {
    this._curCardNum += 1;
    this.playerCurCard = data;
    //  this.curPlayerCard = node;
    this.curPlayerCardData.push(data);
    this.curPlayerCardArr.push(node);
    this.curPlayerCardArr.forEach(element => {
      element.parent = this.selectCardContainer;
    });
  },

  resetCard() {
    this._curCardNum = 0;
    this.curPlayerCardArr.forEach(element => {
      element.parent = this.cardsContainer;
    });
    this.curPlayerCardArr = [];
  },

  onCardOut() {
    if (!this._curCardNum) {
      cc.log("请选择一张卡牌");
      return;
    }
    //合成卡牌
   this.playerCurCard = this.test.synCard(this.curPlayerCardData);
    //失败后再减掉卡牌
    // this._dataMgr.subPlayerCard(this.curPlayerCardData);
    this.judgeWinOrFail();
  },


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
  //  this.onAIFail();
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

  recoveryCenterCards() {
    if (this.cardsPool) {
      this.curPlayerCardArr.forEach(element => {
        this.cardsPool.put(element)
      });
      this.cardsPool.put(this.curAICard)
    }
  },

});