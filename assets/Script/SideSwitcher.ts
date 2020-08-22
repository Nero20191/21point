const {ccclass, property} = cc._decorator;

@ccclass
export default class SideSwitcher extends cc.Component {

    @property([cc.Node])
    retainSideNodes: cc.Node[] = [];

    
    switchSide() {
        this.node.scaleX = -this.node.scaleX;
        for (let i = 0; i < this.retainSideNodes.length; ++i) {
            let curNode = this.retainSideNodes[i];
            curNode.scaleX = -curNode.scaleX;
        }
    }
    
}
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         retainSideNodes: {
//             default: [],
//             type: cc.Node
//         }
//     },

//     // use this for initialization
//     switchSide: function () {
//         this.node.scaleX = -this.node.scaleX;
//         for (var i = 0; i < this.retainSideNodes.length; ++i) {
//             var curNode = this.retainSideNodes[i];
//             curNode.scaleX = -curNode.scaleX;
//         }
//     },
// });
