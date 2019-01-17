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
    currentPlayerCard: [], //选中的卡牌
    _curCardIndex: -1, //当前卡牌索引
    _curCardNum: 0,
    aiCard: cc.Node,
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
    this._aiMgr = c.AI
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
    this.currentPlayerCardArr = [];
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
  onAIEnter () {
    this._aiMgr.onAIAnim(1);
    this._aiMgr.onAIText(1);
  },
  onAIfail () {
    this._aiMgr.onAIAnim(2);
    this._aiMgr.onAIText(2);
  },
  onAIStay () {
    this._aiMgr.onAIAnim(3);
    this._aiMgr.onAIText(3);
  },
  /*-------AI入场，失败，退场---------*/


  onPlayerChooseCard(data, node) {
    this._curCardNum += 1;
    this.playerCurCard = data;
    this.currentPlayerCard = node;
    this.currentPlayerCardArr.push(node);
    this.currentPlayerCardArr.forEach(element => {
      element.parent = this.selectCardContainer;
    });
  },

  resetCard() {
    this._curCardNum = 0;
    this.currentPlayerCardArr.forEach(element => {
      element.parent = this.cardsContainer;
    });
    this.currentPlayerCardArr = [];
  },

  onCardOut() {
    if (!this._curCardNum) {
      cc.log("请选择一张卡牌");
      return;
    }
    //  this.currentAICard.active = true;
    this.judgeWinOrFail();
    // 在数据种去除该卡牌
    let cardArr = this.player.cards;
    for (let i = 0; i < cardArr.length; i++) {
      if (cardArr[i] == this.playerCurCard) {
        cardArr.splice(i, 1);
        console.log('玩家剩余卡牌:', cardArr)
        return
      }
    }

  },

  judgeWinOrFail() {
      this.scheduleOnce(() => {
    this.level.monster.cardValue = 5;//假数据
    let booleValue = this.combatJudge.checkWhoWin(this.playerCurCard, this.level.monster);
    if (booleValue) {
      console.log("玩家赢：");
      this.onPlayerCardWin()
    } else {
      console.log("AI赢");
      this.onAICardWin();
    }
     }, 1);
   // console.log("巅峰对决：", this.level.monster, this.playerCurCard);
  },

  onPlayerCardWin() {
    this.resetCard();
    this.scheduleOnce(() => {
      if (this.AI.data.blood == 1) {
        this.nextFight()
      } else {
        this.AI.data.blood--
        this.onNextTurning()
      }
    }, 1)
  },
  //升级 level + 1 blood + 1
  nextFight() {
    this._dataMgr.upgradePlayerLevel();
    this.resetCard();
    this.onAIRandomCard();
    console.log("下一个回合:", this.player);
  },



  onNextTurning() {
    this.resetCard();
    this.onAIRandomCard();
  },

  onAICardWin() {
    this.onAIStay();
    this.scheduleOnce(() => {
      if (this.player.blood == 1) {
        this.onGameOver()
      } else {
        this.player.blood--;
        this.onNextTurning();
      }
    }, 1)
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
      this.currentPlayerCardArr.forEach(element => {
        this.cardsPool.put(element)
      });
      this.cardsPool.put(this.currentAICard)
    }
  },

});