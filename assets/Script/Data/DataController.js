/**
 * @author uu
 * @file  处理缓存和全局数据
 * @todo 
 * @description 在这里获得所有数据
 * @progress 初始化=>判断是否有存档=>有则显示两个按钮（载入和重新开始），没有则显示开始按钮
 */
cc.Class({
  extends: cc.Component,

  properties: {
    isFristTime: true,
    levelData: cc.JsonAsset, //关卡数据
    kongfuData: cc.JsonAsset, //玩家出招表kongfu.json
    elementData: cc.JsonAsset, //元素表
    itemData: cc.JsonAsset, //道具表
    monsterData: cc.JsonAsset, //怪物表
    cardData: cc.JsonAsset, //卡牌预设表
    skillData: cc.JsonAsset, //怪物技能表
    status: cc.JsonAsset, //状态表
  },
  // -------------------- 全局数据管理-----------------
  start() {
    this._controller = cc.director.getScene().getChildByName('Canvas').getChildByName('Controller').getComponent('Controller')
    this._dialog = this._controller.dialog;
  },
  init() {
    // cc.sys.localStorage.removeItem('userData')
    if (this.checkIsFristTimePlay()) {
      this.initPlayerData()
      this.initLevelData(1)
    } else {
      this.loadData()
    }
    this.lateInit()
  },
  lateInit() {

  },
  //新建游戏时调用
  initPlayerData() {
    this.player = {
      level: 1,
      cards: [],
      item: [],
      progress: 0,
      blood: 1,
      status: [],
      equipment: [],
    }
    this.card = [{
      cardAtt: 0,
      cardValue: 1,
    }, {
      cardAtt: 1,
      cardValue: 1,
    }, {
      cardAtt: 2,
      cardValue: 1,
    }];
    this.player.cards = this.card
  },
  /**
   * 根据当前关卡初始化怪物数据,每次进入新关卡时调用
   * @param {string} level - 关卡数
   */
  initLevelData(level) {
    // todo 拿取json数据并且获取 使用完之后销毁数据
    this.level = this.levelData.json[level]
    // 拿到当前的怪物id
    this.level.monster = this.level.monsterId.split(",")[Math.floor(Math.random() * 2)]
    // 拿到当前的怪物数据
    this.monster = this.monsterData.json[this.level.monster]
    console.log("初始化战斗数据", this.level, this.monster)
  },
  // -------------------- 玩家数据操作-----------------
  /**
   * 玩家通过关卡升级操作
   * @author kunji
   */
  upgradePlayerLevel() {
    this.player.blood += 1;
    this.player.level += 1;
    this.saveData();
  },
  // -------------------- 存档原始与微信API -----------------------
  loadData() {
    let data = JSON.parse(cc.sys.localStorage.getItem('userData'));
    if (!data) {
      this.initPlayerData()
      this.initLevelData(1)
      return
    } else {
      this.player = data.player
      this.card = data.card
      this.level = data.level
      this.initLevelData(this.level)
    }
  },
  saveData() {
    this.player.cards = this.card
    cc.sys.localStorage.setItem('userData', JSON.stringify({
      player: this.player,
      level: this.level
    }));
  },
  checkIsFristTimePlay() {
    let isFristTime = cc.sys.localStorage.getItem('isFristTime')
    if (!isFristTime) {
      cc.sys.localStorage.setItem('isFristTime', false);
      return true
    } else {
      return false
    }
  },



  // loadDataWX() {

  // },
  // saveDataWX() {

  // },
  // checkIsFristTimePlayWX() {
  //   // 判断是否第一次游戏 是新玩家则返回true
  //   let self = this
  //   wx.getStorage({
  //     key: 'isFristTime',
  //     fail: (res) => {
  //       self._controller.gameController.onOpenGuidePage()
  //       wx.setStorage({
  //         key: 'isFristTime',
  //         data: {
  //           isFristTime: 1
  //         }
  //       })
  //       return true
  //     }
  //   })
  //   return false
  // },


  // -------------------- 其他数据存储 ----------------

});