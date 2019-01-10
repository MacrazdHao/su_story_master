/**
 * @author uu
 * @file  卡牌招式与元素数据
 * @todo 
 */
var helper = require('Helper')
var Constants = require("Consts");
var battleData = {
  element: {
    
  },
  kungfu: [
    [],
    [],
  ],
  card: 
    [{
      name: 'punch',
      content: 'give a punch !',
      cardAtt: 0,
      cardValue: 1,
      cardIcon:'fight'
    }, {
      name: 'run',
      content: 'give a run !',
      cardAtt: 1,
      cardValue: 1,
      cardIcon:'speed'
    }, {
      name: 'skill',
      content: 'give a skill !',
      cardAtt: 2,
      cardValue: 1,
      cardIcon:'skill'
    }]
}

module.exports = battleData;