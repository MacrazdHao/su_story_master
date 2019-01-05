var AudioMgr= require("AudioMgr");
var Constants = require("Consts");
cc.Class({
    extends: cc.Component,

    properties: {  
        offSprite: { // 当处于关闭状态的时候，要显示的图片。
            default: null, 
            type: cc.SpriteFrame,
        }, 
        
        onSprite: { // 处于打开状态时候要显示的图片
            default: null, 
            type: cc.SpriteFrame, 
        },
    },


    onLoad: function () {
        let musicPath = Constants.MusicPath;
        cc.log(musicPath,musicPath[1]);
        this.sp = this.node.getComponent(cc.Sprite);
        AudioMgr.playMusic(musicPath[1], true);
    },
    
    start: function() { 
        // 表示是music的开关；
            if (AudioMgr.mute === 1) {
                this.sp.spriteFrame = this.offSprite; 
            }
            else {
                this.sp.spriteFrame = this.onSprite; 
            }
    }, 
    
    // 声音按钮按下，切换状态；
    onSwitchClick: function() {
        var mute;
        mute = (AudioMgr.mute) ? 0 : 1;
        AudioMgr.switchMusic(mute); // 1 静音  0 打开
    
        if (mute) { // off图片
            this.sp.spriteFrame = this.offSprite; 
        }
        else { // on图片。
            this.sp.spriteFrame = this.onSprite;
        }
    }, 
});


