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
    curPlayerCardData: [],//当前卡牌的属性
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
    this.action = c.action;
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
  onAIEnter () {
    this._aiMgr.onAIAnim(1);
    this._aiMgr.onAIText(1);
  },
  onAIFail () {
    this._aiMgr.onAIAnim(2);
    this._aiMgr.onAIText(2);
  },
  onAIStay () {
    this._aiMgr.onAIAnim(3);
    this._aiMgr.onAIText(3);
  },

  onAIRunKill () {

  },

  onAICardWin() {
    this.onAIStay();
    this.scheduleOnce(() => {
      if (this.player.blood == 1) {
        this.onGameOver()
      } else {
        this._dataMgr.subPlayerBlood(1);
        this._dataMgr.subPlayerCard(this.curPlayerCardData);
        this.onNextTurning();
      }
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

  synCard () {
    let len = Object.keys(this.curPlayerCardData).length;
    if (len <= 1)
    return;
    let skill = -1,speed = -1,fight = -1,value,type = -1;
    for (let i in this.curPlayerCardData) {
      value = this.curPlayerCardData[i].cardAtt;
      if(value == 0)
      fight += 1;
      else if (value == 1)
      speed += 1;
      else if (value == 2)
      skill += 1;
    }
    if (fight != -1) {//至少有一张
      if (fight == 2) {//三个力
       type = 0;
      }
      else if (fight == 0 && skill == 0 && speed == 0) 
        type = 3;
      else if (fight == 0 && speed == 0 && skill == -1) {//力速
        type = 1;
      }
      else if (fight == 0 && speed == 1) {//力速速
        type = 1;
      }
      else if (fight == 0 && skill == 0 && speed == -1) {//力技
        type = 0;
      }
      else if (fight == 0 && skill == 1) {//力技技
        type = 2;
      }
      else if (fight == 1 && skill == -1 && speed == -1) {//两张 力力
        type = 0;
      }
      else if (fight == 1 && skill == 0) {//两张 力力技
        type = 0;
      }
      else if (fight == 1 && speed == 0) {//两张 力力速
        type = 0;
      }
    }
    else if (speed!= -1) {
      if (speed == 2) {
        type = 2;
      }
      if (speed == 0 && skill == 0 && fight == -1) {//速技
        type = 2;
      } 
      else if (speed == 0 && skill == 1) {
        type = 2;
      }
      else if (speed == 1 && skill == 0) {
        type = 1;
      }
      else if (speed == 1 && skill == -1 && fight == -1) {
        type = 1;
      }
    }
    else if (skill != -1) {
      if (skill == 1 && speed == -1 && fight == -1) {
        type = 2;
      }
      else if (skill == 2) {
        type = 2;
      }
    }
    this.playerCurCard.cardAtt = type;
    this.playerCurCard.cardValue = len;
    console.log("合成之后的卡牌：",this.playerCurCard);
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
    this.synCard();
    let skill = this._aiMgr.runSkill(this.level.monster);
    //失败后再减掉卡牌
   // this._dataMgr.subPlayerCard(this.curPlayerCardData);
    this.judgeWinOrFail();
  },


  judgeWinOrFail() {
      this.scheduleOnce(() => {
    this.level.monster.cardValue = 100;//假数据
    let booleValue = this.combatJudge.checkWhoWin(this.playerCurCard, this.level.monster);
    if (booleValue) {
      console.log("玩家赢：");
      this.onPlayerCardWin()
    } else {
      console.log("AI赢");
      this.onAICardWin();
    }
     }, 1);
   console.log("巅峰对决：", this.level.monster, this.playerCurCard);
  },

  onPlayerCardWin() {
    this.resetCard();
    this.scheduleOnce(() => {
      if (this.level.monster.blood == 1) {
        this.nextFight()
      } else {
        this._aiMgr.subBlood(1);
        this.onNextTurning();
      }
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
    this.onAIFail();
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