// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
var Actor = require('Actor');
var Utils = require('Utils');
// import Utils from "./model/Util";
@ccclass
export default class Dealer extends cc.Component {

    

    @property
    bestPoint= {
        
        get value() : number {
            let cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
            let minMax = Utils.getMinMaxPoint(cards);
            return minMax.max
        }
    };
    _super: any;
    renderer: any;


    // onLoad () {}

    start () {

    }
    
    init() {
        this._super();
        this.renderer.initDealer();
    }
 
    // 返回是否要牌
    wantHit() {
        var Game = require('Game');
        var Types = require('Types');
 
        let bestPoint = this.bestPoint;
 
        // 已经最大点数
        if (bestPoint.value=== 21) {
            return false;
        }
 
        // 不论抽到什么牌肯定不会爆，那就接着抽
        if (bestPoint.value <= 21 - 10) {
            return true;
        }
 
        var player = Game.instance.player;
        var outcome = Game.instance._getPlayerResult(player, this);
 
        switch (outcome) {
            case Types.Outcome.Win:
                return true;
            case Types.Outcome.Lose:
                return false;
        }
 
        return this.bestPoint.value < 17;
    }
    // update (dt) {}
}

 

 
