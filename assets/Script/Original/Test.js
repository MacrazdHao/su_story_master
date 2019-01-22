/**
 * @author kunji
 * @file  
 * @todo 
 */


cc.Class({
    extends: cc.Component,
    properties: {
    },

    init(c) {
      this._controller = c
      this._game = c.game
      this.lateInit()
    },

    lateInit() {

    },
    synCard(data) {
        if (data.length <= 1)
        return;
        let skill = -1,
        speed = -1,
        fight = -1,
        value,j, type = -1;

        data.forEach(element => {
            j = element.cardAtt;
            value = (j == 0) ? (fight++):(j==1) ? (speed++):(skill++);
        });
       // 未简化
        if (fight != -1) { //至少有一张
          if (fight == 2) { //三个力
            type = 0;
          } else if (fight == 0 && skill == 0 && speed == 0)
            type = 3;
          else if (fight == 0 && speed == 0 && skill == -1) { //力速
            type = 1;
          } else if (fight == 0 && speed == 1) { //力速速
            type = 1;
          } else if (fight == 0 && skill == 0 && speed == -1) { //力技
            type = 0;
          } else if (fight == 0 && skill == 1) { //力技技
            type = 2;
          } else if (fight == 1 && skill == -1 && speed == -1) { //两张 力力
            type = 0;
          } else if (fight == 1 && skill == 0) { //两张 力力技
            type = 0;
          } else if (fight == 1 && speed == 0) { //两张 力力速
            type = 0;
          }
        } else if (speed != -1) {
          if (speed == 2) {
            type = 2;
          }
          if (speed == 0 && skill == 0 && fight == -1) { //速技
            type = 2;
          } else if (speed == 0 && skill == 1) {
            type = 2;
          } else if (speed == 1 && skill == 0) {
            type = 1;
          } else if (speed == 1 && skill == -1 && fight == -1) {
            type = 1;
          }
        } else if (skill != -1) {
          if (skill == 1 && speed == -1 && fight == -1) {
            type = 2;
          } else if (skill == 2) {
            type = 2;
          }
        }
        return {
          cardAtt: type,
          cardValue: len,
          cardName:'',
        }
      },

   
  });



    // init(c) {
    //     this._controller = c
    //     this._game = c.game
    //     this.lateInit()
    // },

    
