// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TossChip extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    // use this for initialization
    play() {
        this.anim.play('chip');
    }
}
// cc.Class({
//     extends: cc.Component,
 
//     properties: {
//         anim: cc.Animation
//     },
 
//     // use this for initialization
//     play: function () {
//         this.anim.play('chip_toss');
//     },
// });
 
