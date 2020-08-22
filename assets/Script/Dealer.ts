const {ccclass, property} = cc._decorator;
//let Actor  = require('./Actor');
import Actor from "./Actor";
import * as Util from "./model/Util";
// import { getMinMaxPoint} from "./model/Util";
@ccclass
export default class Dealer extends Actor {

    bestPoint= {
        get value() : any {
            let cards :any = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
            let minMax = Util.getMinMaxPoint(cards);
            return minMax.max
        },
        override:true
    };
    
    init() {
        super.init();
        this.getComponent("ActorRenderer").initDealer();
    }
 
    // 返回是否要牌
    wantHit() {
        var Game = require('Game');
        var Types = require('Type');
 
        let bestPoint = this.bestPoint;
 
        // 已经最大点数
        if (bestPoint.value=== 21) {
            return false;
        }
 
        // 不论抽到什么牌肯定不会爆，那就接着抽
        if (bestPoint.value <= 21 - 10) {
            return true;
        }
 
        let player = Game.instance.player;
        let outcome = Game.instance._getPlayerResult(player, this);
 
        switch (outcome) {
            case Types.Outcome.Win:
                return true;
            case Types.Outcome.Lose:
                return false;
        }
 
        return this.bestPoint.value < 17;
    }
   
}

 

 
