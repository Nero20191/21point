const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property(cc.Node)
    audioMng: cc.Node;

    onLoad() {
        let audioMng = this.audioMng.getComponent('AudioMng');
        //audioMng.playMusic();
        cc.director.preloadScene('my table', function () {
            cc.log('Next scene preloaded');
        });
    }

    playGame() {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        cc.director.loadScene('table1');
=======
        cc.director.loadScene('my table');
>>>>>>> parent of 938a8ba... 前端
=======
        cc.director.loadScene('my table');
>>>>>>> parent of 938a8ba... 前端
=======
        cc.director.loadScene('my table');
>>>>>>> parent of 938a8ba... 前端
    }

    // called every frame
    update(dt: any) {

    }
}
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         audioMng: cc.Node
//     },

//     // use this for initialization
//     onLoad: function () {
//         this.audioMng = this.audioMng.getComponent('AudioMng');
//         this.audioMng.playMusic();
//         cc.director.preloadScene('table', function () {
//             cc.log('Next scene preloaded');
//         });
//     },

//     playGame: function () {
//         cc.director.loadScene('table');
//     },

//     // called every frame
//     update: function (dt) {

//     },
// });
