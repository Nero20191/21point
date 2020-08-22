// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FXPlayer extends cc.Component {
    anim: cc.Animation;
    sprite: cc.Sprite;
    
    // use this for initialization
    init() {
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.getComponent(cc.Sprite);
    }

    show (show: any) {
        this.sprite.enabled = show;
    }

    playFX (name: any) { // name can be 'blackjack' or 'bust'
        this.anim.stop();
        this.anim.play(name);
    }

    hideFX () {
        this.sprite.enabled = false;
    }
    
}
