const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property(cc.Node)
    audioMng: cc.Node;

    onLoad() {
        let audioMng = this.audioMng.getComponent('AudioMng');
        //audioMng.playMusic();
        cc.director.preloadScene('table1', function () {
            cc.log('Next scene preloaded');
        });
    }

    playGame() {

        cc.director.loadScene('table1');

    }

    // called every frame
    update(dt: any) {

    }
}
