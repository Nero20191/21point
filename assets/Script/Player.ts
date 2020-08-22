
const {ccclass, property} = cc._decorator;
var Actor = require('Actor');
import Actor1 from './Actor';
@ccclass
export default class Player extends Actor  {
    // LIFE-CYCLE CALLBACKS:

    init() {
        this._super();
        this.labelStake = this.renderer.labelStakeOnTable;
        this.stakeNum = 0;
    }
 
    reset() {
        this._super();
        this.resetStake();
    }
 
    addCard(card: any) {
        this._super(card);
 
        // var Game = require('Game');
        // Game.instance.canReport = this.canReport;
    }
 
    addStake(delta: any) {
        this.stakeNum += delta;
        this.updateStake(this.stakeNum);
    }

    resetStake () {
        this.stakeNum = 0;
        this.updateStake(this.stakeNum);
    }
    // 修改前
    // resetStake (delta) {
    //     this.stakeNum = 0;
    //     this.updateStake(this.stakeNum);
    // }
    updateStake(number: any) {
        this.labelStake.string = number;
    }
}
// var Actor = require('Actor');
 
// cc.Class({
//     extends: Actor,
 
//     init: function () {
//         this._super();
//         this.labelStake = this.renderer.labelStakeOnTable;
//         this.stakeNum = 0;
//     },
 
//     reset: function () {
//         this._super();
//         this.resetStake();
//     },
 
//     addCard: function (card) {
//         this._super(card);
 
//         // var Game = require('Game');
//         // Game.instance.canReport = this.canReport;
//     },
 
//     addStake: function (delta) {
//         this.stakeNum += delta;
//         this.updateStake(this.stakeNum);
//     },
 
//     resetStake: function (delta) {
//         this.stakeNum = 0;
//         this.updateStake(this.stakeNum);
//     },
 
//     updateStake: function(number) {
//         this.labelStake.string = number;
//     },
 
// });
 
