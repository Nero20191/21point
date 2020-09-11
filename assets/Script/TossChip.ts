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
 
