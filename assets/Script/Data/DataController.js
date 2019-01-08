/**
 * @author uu
 * @file  处理缓存和全局数据
 * @todo 
 * @description 在这里获得所有数据
 */
var battleData = require("BattleData");
var chapterData = require("ChapterData")
var missionData = require("MissionData")
var monsterData = require("MonsterData")
var statusData = require("StatusData")
cc.Class({
  extends: cc.Component,

  properties: {

  },
  init() {

  },
  lateInit() {

  },
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
  },
  // -------------------- 存档原始与微信API -----------------------
  loadData() {
    this.player = JSON.parse(cc.sys.localStorage.getItem('userData'));
    if (!this.player) {
      initPlayerData()
    }
  },
  saveData() {
    cc.sys.localStorage.setItem('userData', JSON.stringify(this.player));
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
  loadDataWX() {

  },
  saveDataWX() {

  },
  checkIsFristTimePlayWX() {
    // 判断是否第一次游戏 是新玩家则返回true
    let self = this
    wx.getStorage({
      key: 'isFristTime',
      fail: (res) => {
        self._controller.gameController.onOpenGuidePage()
        wx.setStorage({
          key: 'isFristTime',
          data: {
            isFristTime: 1
          }
        })
        return true
      }
    })
    return false
  },
  // -------------------- 其他数据存储 ----------------
});