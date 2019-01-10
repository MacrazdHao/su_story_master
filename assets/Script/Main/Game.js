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
    selectCardContainer:cc.Node,
    cardPrefab: cc.Prefab,
    currentPlayerCard: [],//选中的卡牌
    _curCardIndex: -1,//当前卡牌索引
    _curCardNum:0,
    aiCard:cc.Node,
    // 战斗状态
    // 0:未知状态/未初始化状态/不可操作状态
    // 1:只有在1下才是可自由操作卡牌状态
    // 2:裁判判断阶段/动画阶段/不可操作状态
  },
  init(c) {
    this._controller = c;
    this.createPools();
  },
  lateInit() {
    
  },
  start () {
    this.endContent = {
      title:"游戏结束了！",
      content: "you failed! QAQ",
    }
  },
  initUI () {
    this.status = 1;
    this.player = this._controller.data.player;
    this.monster = this._controller.data.monster;
    this.combatJudge = this._controller.referee;
    this.dialog = this._controller.dialog;
    this.page = this._controller.page;
    this.onPlayerLoadCard();
    this.onAIRandomCard();
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

  onPlayerLoadCard () {
    this.recoveryUICards();
    this.currentPlayerCardArr = [];
    let cardArr = this.player.cards;
    cardArr.forEach(element => {
      this.instantiateCard(this,element,this.cardsContainer);
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

  onAIRandomCard () {
    let randomNum = Math.floor(Math.random() * 2);
    let monsterCard = this.monster.cards[randomNum];
    this._aiCardData = monsterCard;
    this.instantiateCard(this,monsterCard,this.aiCard);
    this.currentAICard = this.aiCard.children[0];
    this.currentAICard.active = false;
    this.currentAICard.x = 206;
    this.currentAICard.y = 142;
  },
  

  onPlayerChooseCard (data,node) {
    this._curCardNum += 1;
    this._playerCurCardData = data;
    this.currentPlayerCard = node;
    this.currentPlayerCardArr.push(node);
    this.currentPlayerCardArr.forEach(element => {
      element.parent = this.selectCardContainer; 
    });
  },

  resetCard () {
    this._curCardNum = 0;
    this.currentPlayerCardArr.forEach(element => {
      element.parent =  this.cardsContainer; 
    });
    this.currentPlayerCardArr = [];
  },

  onCardOut() {
   if (!this._curCardNum) {
     cc.log("请选择一张卡牌");
     return;
   }
   this.currentAICard.active = true;
   this.judgeWinOrFail();
    // 在数据种去除该卡牌
    let cardArr = this.player.cards;
    for (let i = 0; i < cardArr.length; i++) {
      if (cardArr[i] == this._playerCurCardData) {
        cardArr.splice(i, 1);
        console.log('玩家剩余卡牌:', cardArr)
        return
      }
    }
    
  },
  judgeWinOrFail () {
  //  this.scheduleOnce(() => {
      if (this.combatJudge.checkWhoWin(this._aiCardData,this._playerCurCardData)) {
        this.onPlayerCardWin()
      } else {
        this.onAICardWin()
      }
    // }, 1);
    console.log("巅峰对决：",this._aiCardData,this._playerCurCardData);
  },
  onPlayerCardWin() {
    this.resetCard();
    // this.scheduleOnce(() => {
    //   if (this.AI.data.blood == 1) {
    //     this.nextFight()
    //   } else {
    //     this.AI.data.blood--
    //     this.onNextTurning()
    //   }
    // }, 1)
  },
  onAICardWin() {
    this.scheduleOnce(() => {
      if (this.player.blood == 1) {
        this.onGameOver()
      } else {
        this.player.blood--;
        this.onNextTurning()
      }
    }, 1)
  },
  
  onGameOver() {
    let func = () => {
      this._controller.init();
      this._controller.page.onOpenPage(2);
    }; 
    cc.log(this.endContent);
    this._controller.dialog.init(this.node, this.endContent, func);
    cc.log('游戏结束了');
    this.recoveryCenterCards();
  },

  recoveryCenterCards() {
    cc.log("放回去");
    if (this.cardsPool) {
      this.currentPlayerCardArr.forEach(element => {
        this.cardsPool.put(element)
      });
      this.cardsPool.put(this.currentAICard)
    }
  },
  
});