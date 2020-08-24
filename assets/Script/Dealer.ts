const {ccclass, property} = cc._decorator;
//let Actor  = require('./Actor');
import Actor from "./Actor";
//import * as Util from "./model/Util";
import {Util} from "./model/Util";
@ccclass
export default class Dealer extends Actor {
    @property
    bestPoint= {
        get() : any {
            let cards :any = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
            let minMax = Util.getMinMaxPoint(cards);
            return minMax.max
        },
        override:true
    };
    
    init() {
        super.init();
        //this.getComponent("ActorRenderer").initDealer();
        let renderer = this.getComponent("ActorRenderer");
        renderer.initDealer();
    }
 
    // 返回是否要牌
    wantHit() {
        let Game = require('Game');
        let Types = require('Type');
 
        let bestPoint = this.bestPoint.get();
 
        // 已经最大点数
        if (bestPoint=== 21) {
            return false;
        }
 
        // 不论抽到什么牌肯定不会爆，那就接着抽
        if (bestPoint <= 21 - 10) {
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
 
        return this.bestPoint.get() < 17;
    }
   
}

// var Actor = require('Actor');
// var Utils = require('Utils');

// cc.Class({
//     extends: Actor,

//     properties: {
//         // 手上最接近 21 点的点数（有可能超过 21 点）
//         bestPoint: {
//             get: function () {
//                 var cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
//                 var minMax = Utils.getMinMaxPoint(cards);
//                 return minMax.max;
//             },
//             override: true
//         },
//     },

//     init: function () {
//         this._super();
//         this.renderer.initDealer();
//     },

//     // 返回是否要牌
//     wantHit: function () {
//         var Game = require('Game');
//         var Types = require('Types');

//         var bestPoint = this.bestPoint;

//         // 已经最大点数
//         if (bestPoint === 21) {
//             return false;
//         }

//         // 不论抽到什么牌肯定不会爆，那就接着抽
//         if (bestPoint <= 21 - 10) {
//             return true;
//         }

//         var player = Game.instance.player;
//         var outcome = Game.instance._getPlayerResult(player, this);

//         switch (outcome) {
//             case Types.Outcome.Win:
//                 return true;
//             case Types.Outcome.Lose:
//                 return false;
//         }

//         return this.bestPoint < 17;
//     },
// });


 
