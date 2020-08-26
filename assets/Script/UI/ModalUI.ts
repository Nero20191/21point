//暂时没用
const {ccclass, property} = cc._decorator;

@ccclass
export default class ModalUI extends cc.Component {

    @property(cc.Node)
    mask: cc.Node ;

    onLoad() {
 
    }
 
    onEnable() {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    }
 
    onDisable() {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    }
 
    // called every frame, uncomment this function to activate update callback

    // update (dt) {}
}


 
