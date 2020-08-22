// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Game = require('../Game');
@ccclass
export default class InGameUI extends cc.Component {

    @property(cc.Node)
    panelChat: cc.Node = null;
    @property(cc.Node)
    panelSocial: cc.Node = null;
    @property(cc.Node)
    betStateUI: cc.Node = null;
    @property(cc.Node)
    gameStateUI: cc.Node = null;
    @property(cc.Label)
    resultTxt: cc.Label = null;
    @property(cc.ProgressBar)
    betCounter: cc.ProgressBar = null;
    @property(cc.Node)
    btnStart: cc.Node = null;
    @property(cc.Label)
    labelTotalChips: cc.Label = null;

    betDuration: number;
    betTimer: number;
    isBetCounting: boolean;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

   
    // use this for initialization
    init(betDuration:number){
        //this.panelChat.active = false;
        //this.panelSocial.active = false;
        this.resultTxt.enabled = false;
        this.betStateUI.active = true;
        this.gameStateUI.active = false;
        // this.resultStateUI.active = false;
        this.btnStart.active = false;
        this.betDuration = betDuration;
        this.betTimer = 0;
        //this.isBetCounting = false;
    }
    // update (dt) {}
    startCountdown() {
        if (this.betCounter) {
            this.betTimer = 0;
            this.isBetCounting = true;
        }
    }

    resetCountdown() {
        if (this.betCounter) {
            this.betTimer = 0;
            this.isBetCounting = false;
            this.betCounter.progress = 0;
        }
    }

    showBetState() {
        this.betStateUI.active = true;
        this.gameStateUI.active = false;
        this.btnStart.active = false;
    }

    showGameState() {
        this.betStateUI.active = false;
        this.gameStateUI.active = true;
        this.btnStart.active = false;
    }

    showResultState() {
        this.betStateUI.active = false;
        this.gameStateUI.active = false;
        this.btnStart.active = true;
    }

    toggleChat() {
        this.panelChat.active = !this.panelChat.active;
    }

    toggleSocial() {
        this.panelSocial.active = !this.panelSocial.active;
    }

    // called every frame
    update(dt) {
        if (this.isBetCounting) {
            this.betCounter.progress = this.betTimer/this.betDuration;
            this.betTimer += dt;
            if (this.betTimer >= this.betDuration) {
                this.isBetCounting = false;
                this.betCounter.progress = 1;
            }
        }
    }
}


// cc.Class({
//     extends: cc.Component,

//     properties: {
//         panelChat: cc.Node,
//         panelSocial: cc.Node,
//         betStateUI: cc.Node,
//         gameStateUI: cc.Node,
//         resultTxt: cc.Label,
//         betCounter: cc.ProgressBar,
//         btnStart: cc.Node,
//         labelTotalChips: cc.Label
//     },

//     // use this for initialization
//     init: function (betDuration) {
//         this.panelChat.active = false;
//         this.panelSocial.active = false;
//         this.resultTxt.enabled = false;
//         this.betStateUI.active = true;
//         this.gameStateUI.active = false;
//         // this.resultStateUI.active = false;
//         this.btnStart.active = false;
//         this.betDuration = betDuration;
//         this.betTimer = 0;
//         this.isBetCounting = false;
//     },

//     startCountdown: function() {
//         if (this.betCounter) {
//             this.betTimer = 0;
//             this.isBetCounting = true;
//         }
//     },

//     resetCountdown: function() {
//         if (this.betCounter) {
//             this.betTimer = 0;
//             this.isBetCounting = false;
//             this.betCounter.progress = 0;
//         }
//     },

//     showBetState: function () {
//         this.betStateUI.active = true;
//         this.gameStateUI.active = false;
//         this.btnStart.active = false;
//     },

//     showGameState: function () {
//         this.betStateUI.active = false;
//         this.gameStateUI.active = true;
//         this.btnStart.active = false;
//     },

//     showResultState: function () {
//         this.betStateUI.active = false;
//         this.gameStateUI.active = false;
//         this.btnStart.active = true;
//     },

//     toggleChat: function () {
//         this.panelChat.active = !this.panelChat.active;
//     },

//     toggleSocial: function () {
//         this.panelSocial.active = !this.panelSocial.active;
//     },

//     // called every frame
//     update: function (dt) {
//         if (this.isBetCounting) {
//             this.betCounter.progress = this.betTimer/this.betDuration;
//             this.betTimer += dt;
//             if (this.betTimer >= this.betDuration) {
//                 this.isBetCounting = false;
//                 this.betCounter.progress = 1;
//             }
//         }
//     },
// });
