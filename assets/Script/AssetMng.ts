// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AssetMng extends cc.Component {

  
    @property(cc.SpriteFrame)
    texBust: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    texCardInfo: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    texCountdown: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    texBetCountdown: cc.SpriteFrame = null;
    @property([cc.SpriteFrame])
    playerPhotos: cc.SpriteFrame[] = [];
    
}


 
