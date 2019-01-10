/**
 * @author uu
 * @file  怪物数据
 * @todo 
 */
var helper = require('Helper')
var Constants = require("Consts");
var moster = {
  name: '',
  words: ['', '', ''],
  blood: 1,
  card: [],
  status: [],
  level: 1,
  cardValue:1,
  id: 0,//根据id读取Prefab
}
var monsterData = {
  monsterCard:[{
    name: '史莱姆',
    conten: '人人喊打',
    spriteType: 0,
    blood: 1,
    cards: [0,0,0],
    cardValue:1,
    cardIcon:'fight'
  }, {
    name: '史莱姆',
    conten: '人人喊打',
    spriteType: 0,
    blood: 1,
    cards: [0,0,0],
    cardValue:1,
    cardIcon:'speed'
  }, {
    name: '史莱姆',
    conten: '人人喊打',
    spriteType: 0,
    blood: 1,
    cards: [0,0,0],
    cardValue:1,
    cardIcon:'skill'
  }]
}

module.exports = monsterData;