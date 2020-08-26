const { ccclass, property } = cc._decorator;
//var players = require('PlayerData').players;
import { players } from "./UI/PlayerData";
//var Decks = require('Deck');
import { Decks } from "./model/Deck";
//var Types = require('Type');
import { CardType, Card, ActorPlayingState, Hand, Outcome } from "./model/Type";
//var ActorPlayingState = Types.ActorPlayingState;
import { Fsm } from "./model/game-fsm";

@ccclass
class Game extends cc.Component {
  @property([cc.Node])
  playerAnchors: cc.Node[] = [];

  @property(cc.Prefab)
  playerPrefab: cc.Prefab = null;

  @property(cc.Node)
  dealer: cc.Node = null;

  @property(cc.Node)
  inGameUI: cc.Node;

  @property(cc.Node)
  betUI: cc.Node = null;

  @property(cc.Node)
  assetMng: cc.Node = null;

  @property(cc.Node)
  audioMng: cc.Node = null;

  @property
  turnDuration = 0;

  @property
  betDuration = 0;

  @property
  totalChipsNum = 0;

  @property
  totalDiamondNum = 0;

  @property({
    type: cc.Integer,
  })
  numberOfDecks = 1;

  private static instance: Game;
  // public static instance = new Game();
  public static getInstance = () => Game.instance;

  player: any;
  info: any;
  totalChips: any;
  decks: any;
  fsm: any;

  // use this for initialization
  onLoad() {
    Game.instance = this;
    let game = Game.getInstance();

    //this.inGameUI = this.inGameUI.getComponent('InGameUI');
    let inGameUI = this.inGameUI.getComponent("InGameUI");
    console.log("inGameUI");

    //let assetMng = this.assetMng.getComponent('AssetMng');
    //let audioMng = this.audioMng.getComponent('AudioMng');

    let betUI = this.betUI.getComponent("Bet");
    inGameUI.init(this.betDuration);

    betUI.init();
    let dealer = this.dealer.getComponent("Dealer");
    dealer.init();

    //
    this.player = null;
    this.createPlayers();

    // shortcut to ui element
    this.info = inGameUI.resultTxt;
    this.totalChips = inGameUI.labelTotalChips;

    // init logic
    this.decks = new Decks(this.numberOfDecks);
    this.fsm = Fsm;
    this.fsm.init(this);

    // start
    this.updateTotalChips();

    //this.audioMng.playMusic();
  }

  addStake(delta: any): boolean {
    if (this.totalChipsNum < delta) {
      console.log("not enough chips!");
      this.info.enabled = true;
      this.info.string = "金币不足!";
      return false;
    } else {
      this.totalChipsNum -= delta;
      this.updateTotalChips();
      this.player.addStake(delta);
      //this.audioMng.playChips();
      this.info.enabled = false;
      this.info.string = "请下注";
      return true;
    }
  }

  resetStake() {
    this.totalChipsNum += this.player.stakeNum;
    this.player.resetStake();
    this.updateTotalChips();
  }

  updateTotalChips() {
    this.totalChips.string = this.totalChipsNum;
    this.player.renderer.updateTotalStake(this.totalChipsNum);
  }

  createPlayers() {
    for (var i = 0; i < 3; ++i) {
      var playerNode = cc.instantiate(this.playerPrefab);
      var anchor = this.playerAnchors[i];
      var switchSide = i > 2;
      anchor.addChild(playerNode);
      playerNode.position = cc.v3(0, 0);
      let player_s: any[] = players;
      var playerInfoPos = cc.find("anchorPlayerInfo", anchor).getPosition();
      var stakePos = cc.find("anchorStake", anchor).getPosition();
      var actorRenderer = playerNode.getComponent("ActorRenderer");
      actorRenderer.init(
        player_s[i],
        playerInfoPos,
        stakePos,
        this.turnDuration,
        switchSide,
        this
      );
      if (i === 2) {
        this.player = playerNode.getComponent("Player");
        this.player.init();
      }
    }
  }

  // UI EVENT CALLBACKS

  // 玩家要牌
  hit() {
    this.player.addCard(this.decks.draw());
    if (this.player.state === ActorPlayingState.Bust) {
      // if every player end
      this.fsm.onPlayerActed();
    }

    //this.audioMng.playCard();

    //if (this.dealer.state === ActorPlayingState.Normal) {
    //    if (this.dealer.wantHit()) {
    //        this.dealer.addCard(this.decks.draw());
    //    }
    //    else {
    //        this.dealer.stand();
    //    }
    //}
    //
    //if (this.dealer.state === ActorPlayingState.Bust) {
    //    this.state = GamingState.End;
    //}
    //this.audioMng.playButton();
  }

  // 玩家停牌
  stand() {
    this.player.stand();

    //this.audioMng.playButton();

    // if every player end
    this.fsm.onPlayerActed();
  }

  //
  deal() {
    this.fsm.toDeal();
    //this.audioMng.playButton();
  }

  //
  start() {
    this.fsm.toBet();
    //this.audioMng.playButton();
  }

  // 玩家报到
  report() {
    this.player.report();

    // if every player end
    this.fsm.onPlayerActed();
  }

  quitToMenu() {
    cc.director.loadScene("menu");
  }

  // FSM CALLBACKS

  onEnterDealState() {
    let betUI = this.betUI.getComponent("Bet");
    let inGameUI = this.inGameUI.getComponent("InGameUI");
    let de = this.dealer.getComponent("Dealer");
    betUI.resetTossedChips();
    
    inGameUI.resetCountdown();
    this.player.renderer.showStakeChips(this.player.stakeNum);
    this.player.addCard(this.decks.draw());

    let holdCard = this.decks.draw();
    
    de.addHoleCard(holdCard);
    this.player.addCard(this.decks.draw());
    de.addCard(this.decks.draw());

   
    // this.dealer.addHoleCard(holdCard);
    // this.player.addCard(this.decks.draw());
    // this.dealer.addCard(this.decks.draw());
    
    //this.audioMng.playCard();
    this.fsm.onDealed();
  }

  onPlayersTurnState(enter: any) {
    if (enter) {
      let inGameUI = this.inGameUI.getComponent("InGameUI");
      inGameUI.showGameState();
    }
  }

  onEnterDealersTurnState() {
    let dealer = this.dealer.getComponent("Dealer");
    while (dealer.state === ActorPlayingState.Normal) {
      if (dealer.wantHit()) {
        dealer.addCard(this.decks.draw());
      } else {
        dealer.stand();
      }
    }
    this.fsm.onDealerActed();
  }

  // 结算
  onEndState(enter: any) {
    if (enter) {
      let dealer = this.dealer.getComponent("Dealer");
      dealer.revealHoldCard();
      let inGameUI = this.inGameUI.getComponent("InGameUI");
      inGameUI.showResultState();

      let outcome = this._getPlayerResult(this.player, this.dealer);
      switch (outcome) {
        case Outcome.Win:
          this.info.string = "You Win";
          //(this as any).audioMng.pauseMusic();
          //(this as any).audioMng.playWin();
          // 拿回原先自己的筹码
          this.totalChipsNum += this.player.stakeNum;
          // 奖励筹码
          var winChipsNum = this.player.stakeNum;
          if (!(this.player.state === ActorPlayingState.Report)) {
            if (this.player.hand === Hand.BlackJack) {
              winChipsNum *= 1.5;
            } else {
              // 五小龙
              winChipsNum *= 2.0;
            }
          }
          this.totalChipsNum += winChipsNum;
          this.updateTotalChips();
          break;

        case Outcome.Lose:
          this.info.string = "You Lose";
          //(this as any).audioMng.pauseMusic();
          //(this as any).audioMng.playLose();
          break;

        case Outcome.Tie:
          this.info.string = "Draw";
          // 退还筹码
          this.totalChipsNum += this.player.stakeNum;
          this.updateTotalChips();
          break;
      }
    }

    this.info.enabled = enter;
  }

  // 下注
  onBetState(enter: any) {
    if (enter) {
      this.decks.reset();
      this.player.reset();
      let dealer = this.dealer.getComponent("Dealer");
      dealer.reset();
      this.info.string = "请下注";
      let inGameUI = this.inGameUI.getComponent("InGameUI");
      inGameUI.showBetState();
      inGameUI.startCountdown();

      //(this as any).audioMng.resumeMusic();
    }
    this.info.enabled = enter;
  }

  // PRIVATES

  // 判断玩家输赢
  _getPlayerResult(player, dealer) {
    let outcome = Outcome;
    if (player.state === ActorPlayingState.Bust) {
      return outcome.Lose;
    } else if (dealer.state === ActorPlayingState.Bust) {
      return outcome.Win;
    } else {
      if (player.state === ActorPlayingState.Report) {
        return outcome.Win;
      } else {
        if (player.hand > dealer.hand) {
          return outcome.Win;
        } else if (player.hand < dealer.hand) {
          return outcome.Lose;
        } else {
          if (player.bestPoint === dealer.bestPoint) {
            return outcome.Tie;
          } else if (player.bestPoint < dealer.bestPoint) {
            return outcome.Lose;
          } else {
            return outcome.Win;
          }
        }
      }
    }
  }

  // update (dt) {}
}

export default Game;
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         playerAnchors: {
//             default: [],
//             type: cc.Node
//         },
//         playerPrefab: cc.Prefab,
//         dealer: cc.Node,
//         inGameUI: cc.Node,
//         betUI: cc.Node,
//         assetMng: cc.Node,
//         audioMng: cc.Node,
//         turnDuration: 0,
//         betDuration: 0,
//         totalChipsNum: 0,
//         totalDiamondNum: 0,
//         numberOfDecks: {
//             default: 1,
//             type: cc.Integer
//         }
//     },

//     statics: {
//         instance: null
//     },

//     // use this for initialization
//     onLoad: function () {
//         Game.instance = this;
//         this.inGameUI = this.inGameUI.getComponent('InGameUI');
//         this.assetMng = this.assetMng.getComponent('AssetMng');
//         this.audioMng = this.audioMng.getComponent('AudioMng');
//         this.betUI = this.betUI.getComponent('Bet');
//         this.inGameUI.init(this.betDuration);
//         this.betUI.init();
//         this.dealer = this.dealer.getComponent('Dealer');
//         this.dealer.init();

//         //
//         this.player = null;
//         this.createPlayers();

//         // shortcut to ui element
//         this.info = this.inGameUI.resultTxt;
//         this.totalChips = this.inGameUI.labelTotalChips;

//         // init logic
//         this.decks = new Decks(this.numberOfDecks);
//         this.fsm = Fsm;
//         this.fsm.init(this);

//         // start
//         this.updateTotalChips();

//         this.audioMng.playMusic();
//     },

//     addStake: function (delta) {
//         if (this.totalChipsNum < delta) {
//             console.log('not enough chips!');
//             this.info.enabled = true;
//             this.info.string = '金币不足!';
//             return false;
//         } else {
//             this.totalChipsNum -= delta;
//             this.updateTotalChips();
//             this.player.addStake(delta);
//             this.audioMng.playChips();
//             this.info.enabled = false;
//             this.info.string = '请下注';
//             return true;
//         }

//     },

//     resetStake: function() {
//         this.totalChipsNum += this.player.stakeNum;
//         this.player.resetStake();
//         this.updateTotalChips();
//     },

//     updateTotalChips: function() {
//         this.totalChips.string = this.totalChipsNum;
//         this.player.renderer.updateTotalStake(this.totalChipsNum);
//     },

//     createPlayers: function () {
//         for (var i = 0; i < 5; ++i) {
//             var playerNode = cc.instantiate(this.playerPrefab);
//             var anchor = this.playerAnchors[i];
//             var switchSide = (i > 2);
//             anchor.addChild(playerNode);
//             playerNode.position = cc.v2(0, 0);

//             var playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
//             var stakePos = cc.find('anchorStake', anchor).getPosition();
//             var actorRenderer = playerNode.getComponent('ActorRenderer');
//             actorRenderer.init(players[i], playerInfoPos, stakePos, this.turnDuration, switchSide);
//             if (i === 2) {
//                 this.player = playerNode.getComponent('Player');
//                 this.player.init();
//             }
//         }
//     },

//     // UI EVENT CALLBACKS

//     // 玩家要牌
//     hit: function () {
//         this.player.addCard(this.decks.draw());
//         if (this.player.state === ActorPlayingState.Bust) {
//             // if every player end
//             this.fsm.onPlayerActed();
//         }

//         this.audioMng.playCard();

//         //if (this.dealer.state === ActorPlayingState.Normal) {
//         //    if (this.dealer.wantHit()) {
//         //        this.dealer.addCard(this.decks.draw());
//         //    }
//         //    else {
//         //        this.dealer.stand();
//         //    }
//         //}
//         //
//         //if (this.dealer.state === ActorPlayingState.Bust) {
//         //    this.state = GamingState.End;
//         //}
//         this.audioMng.playButton();
//     },

//     // 玩家停牌
//     stand: function () {
//         this.player.stand();

//         this.audioMng.playButton();

//         // if every player end
//         this.fsm.onPlayerActed();
//     },

//     //
//     deal: function () {
//         this.fsm.toDeal();
//         this.audioMng.playButton();
//     },

//     //
//     start: function () {
//         this.fsm.toBet();
//         this.audioMng.playButton();
//     },

//     // 玩家报到
//     report: function () {
//         this.player.report();

//         // if every player end
//         this.fsm.onPlayerActed();
//     },

//     quitToMenu: function () {
//         cc.director.loadScene('menu');
//     },

//     // FSM CALLBACKS

//     onEnterDealState: function () {
//         this.betUI.resetTossedChips();
//         this.inGameUI.resetCountdown();
//         this.player.renderer.showStakeChips(this.player.stakeNum);
//         this.player.addCard(this.decks.draw());
//         var holdCard = this.decks.draw();
//         this.dealer.addHoleCard(holdCard);
//         this.player.addCard(this.decks.draw());
//         this.dealer.addCard(this.decks.draw());
//         this.audioMng.playCard();
//         this.fsm.onDealed();
//     },

//     onPlayersTurnState: function (enter) {
//         if (enter) {
//             this.inGameUI.showGameState();
//         }
//     },

//     onEnterDealersTurnState: function () {
//         while (this.dealer.state === ActorPlayingState.Normal) {
//             if (this.dealer.wantHit()) {
//                 this.dealer.addCard(this.decks.draw());
//             }
//             else {
//                 this.dealer.stand();
//             }
//         }
//         this.fsm.onDealerActed();
//     },

//     // 结算
//     onEndState: function (enter) {
//         if (enter) {
//             this.dealer.revealHoldCard();
//             this.inGameUI.showResultState();

//             var outcome = this._getPlayerResult(this.player, this.dealer);
//             switch (outcome) {
//                 case Types.Outcome.Win:
//                     this.info.string = 'You Win';
//                     this.audioMng.pauseMusic();
//                     this.audioMng.playWin();
//                     // 拿回原先自己的筹码
//                     this.totalChipsNum += this.player.stakeNum;
//                     // 奖励筹码
//                     var winChipsNum = this.player.stakeNum;
//                     if (!this.player.state === Types.ActorPlayingState.Report) {
//                         if (this.player.hand === Types.Hand.BlackJack) {
//                             winChipsNum *= 1.5;
//                         }
//                         else {
//                             // 五小龙
//                             winChipsNum *= 2.0;
//                         }
//                     }
//                     this.totalChipsNum += winChipsNum;
//                     this.updateTotalChips();
//                     break;

//                 case Types.Outcome.Lose:
//                     this.info.string = 'You Lose';
//                     this.audioMng.pauseMusic();
//                     this.audioMng.playLose();
//                     break;

//                 case Types.Outcome.Tie:
//                     this.info.string = 'Draw';
//                     // 退还筹码
//                     this.totalChipsNum += this.player.stakeNum;
//                     this.updateTotalChips();
//                     break;
//             }
//         }

//         this.info.enabled = enter;
//     },

//     // 下注
//     onBetState: function  (enter) {
//         if (enter) {
//            this.decks.reset();
//            this.player.reset();
//            this.dealer.reset();
//            this.info.string = '请下注';
//            this.inGameUI.showBetState();
//            this.inGameUI.startCountdown();

//            this.audioMng.resumeMusic();
//         }
//         this.info.enabled = enter;
//     },

//     // PRIVATES

//     // 判断玩家输赢
//     _getPlayerResult: function (player, dealer) {
//         var Outcome = Types.Outcome;
//         if (player.state === ActorPlayingState.Bust) {
//             return Outcome.Lose;
//         }
//         else if (dealer.state === ActorPlayingState.Bust) {
//             return Outcome.Win;
//         }
//         else {
//             if (player.state === ActorPlayingState.Report) {
//                 return Outcome.Win;
//             }
//             else {
//                 if (player.hand > dealer.hand) {
//                     return Outcome.Win;
//                 }
//                 else if (player.hand < dealer.hand) {
//                     return Outcome.Lose;
//                 }
//                 else {
//                     if (player.bestPoint === dealer.bestPoint) {
//                         return Outcome.Tie;
//                     }
//                     else if (player.bestPoint < dealer.bestPoint) {
//                         return Outcome.Lose;
//                     }
//                     else {
//                         return Outcome.Win;
//                     }
//                 }
//             }
//         }
//     },

// });
