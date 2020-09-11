// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import {players} from '../model/PlayerData';
const {ccclass, property} = cc._decorator;

@ccclass
export default class RankList extends cc.Component {

    @property(cc.Prefab)
    prefabRankItem: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    
    @property
    rankCount = 0;
    content: any;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onLoad() {
        this.content = this.scrollView.content;
        this.populateList();
    }

    populateList() {
        for (let i = 0; i < this.rankCount; ++i) {
            let playerInfo = players[i];
            let item = cc.instantiate(this.prefabRankItem);
            item.getComponent('RankItem').init(i, playerInfo);
            this.content.addChild(item);
        }
    }
    // called every frame
   
    // update (dt) {}
}
// const players = require('PlayerData').players;

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         scrollView: cc.ScrollView,
//         prefabRankItem: cc.Prefab,
//         rankCount: 0
//     },

//     // use this for initialization
//     onLoad: function () {
//         this.content = this.scrollView.content;
//         this.populateList();
//     },

//     populateList: function() {
//         for (var i = 0; i < this.rankCount; ++i) {
//             var playerInfo = players[i];
//             var item = cc.instantiate(this.prefabRankItem);
//             item.getComponent('RankItem').init(i, playerInfo);
//             this.content.addChild(item);
//         }
//     },

//     // called every frame
//     update: function (dt) {

//     },
// });
