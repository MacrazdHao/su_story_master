/**
 * @author uu
 * @file  卡牌招式与元素数据
 * @todo 
 */
var helper = require('Helper')
var Constants = require("Consts");
var battleData = {
  element: [
    {
      "id": "1",
      "name": "火",
      "元素": "火",
      "伤害倍数": "1.5",
      "触发状态": "燃烧",
      "time": "2"
    },
    {
      "id": "2",
      "name": "水",
      "元素": "水",
      "伤害倍数": "1.2",
      "触发状态": "潮湿",
      "time": "2"
    },
    {
      "id": "3",
      "name": "毒",
      "元素": "毒",
      "伤害倍数": "1.2",
      "触发状态": "中毒",
      "time": "3"
    },
    {
      "id": "4",
      "name": "电",
      "元素": "电",
      "伤害倍数": "1.2",
      "触发状态": "感电",
      "time": "1"
    },
    {
      "id": "6",
      "name": "爆炸",
      "元素": "火 水",
      "伤害倍数": "2",
      "触发状态": "眩晕",
      "time": "1"
    },
    {
      "id": "7",
      "name": "毒气",
      "元素": "火 毒",
      "伤害倍数": "1.5",
      "触发状态": "溃烂",
      "time": "2"
    },
    {
      "id": "8",
      "name": "辐射",
      "元素": "火 电",
      "伤害倍数": "2",
      "触发状态": "微波",
      "time": "1"
    },
    {
      "id": "9",
      "name": "病毒",
      "元素": "水 毒",
      "伤害倍数": "1.2",
      "触发状态": "感染",
      "time": "5"
    },
    {
      "id": "10",
      "name": "电磁",
      "元素": "水 电",
      "伤害倍数": "2",
      "触发状态": "强电流",
      "time": "5"
    },
    {
      "id": "12",
      "name": "腐蚀",
      "元素": "毒 电",
      "伤害倍数": "1.3",
      "触发状态": "化学灼烧",
      "time": "3"
    },
  ],
  kungfu: [],
  card: [{
    name: '力量',
    content: 'give a punch !',
    cardAtt: 0,
    cardValue: 1,
    cardIcon: 'fight'
  }, {
    name: '速度',
    content: 'give a run !',
    cardAtt: 1,
    cardValue: 1,
    cardIcon: 'speed'
  }, {
    name: '技巧',
    content: 'give a skill !',
    cardAtt: 2,
    cardValue: 1,
    cardIcon: 'skill'
  }]
}

module.exports = battleData;