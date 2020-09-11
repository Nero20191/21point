const { ccclass, property } = cc._decorator;

import { players } from "./model/PlayerData";
import { Decks } from "./model/Deck";
import { CardType, Card, ActorPlayingState, Hand, Outcome } from "./model/Type";
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
  player2: any;

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
    this.player2 = null;
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
      this.info.string = "Not enough chips!";
      return false;
    } else {
      this.totalChipsNum -= delta;
      this.updateTotalChips();
      this.player.addStake(delta);
      //this.audioMng.playChips();
      this.info.enabled = false;
      this.info.string = "Please place a bet!";
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
    let i = 0;
    let playerNode = cc.instantiate(this.playerPrefab);
    let anchor = this.playerAnchors[i];
    let switchSide = i > 2;
    anchor.addChild(playerNode);
    playerNode.position = cc.v3(500, -240);
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
    this.player = playerNode.getComponent("Player");
        this.player.init();
    // for (let i = 0; i < 3; ++i) {
    //   let playerNode = cc.instantiate(this.playerPrefab);
    //   let anchor = this.playerAnchors[i];
    //   let switchSide = i > 2;
    //   anchor.addChild(playerNode);
    //   playerNode.position = cc.v3(0, 0);
    //   let player_s: any[] = players;
    //   var playerInfoPos = cc.find("anchorPlayerInfo", anchor).getPosition();
    //   var stakePos = cc.find("anchorStake", anchor).getPosition();
    //   var actorRenderer = playerNode.getComponent("ActorRenderer");
    //   actorRenderer.init(
    //     player_s[i],
    //     playerInfoPos,
    //     stakePos,
    //     this.turnDuration,
    //     switchSide,
    //     this
    //   );
    //   if (i === 0) {
    //     this.player = playerNode.getComponent("Player");
    //     this.player.init();
    //     // this.player2 = playerNode.getComponent("Player");
    //     // this.player2.init();
    //   }
    // }
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
    let _dealer = this.dealer.getComponent("Dealer");
    betUI.resetTossedChips();
    
    inGameUI.resetCountdown();
    this.player.renderer.showStakeChips(this.player.stakeNum);
    this.player.addCard(this.decks.draw());

    let holdCard = this.decks.draw();
    
    _dealer.addHoleCard(holdCard);
    this.player.addCard(this.decks.draw());
    _dealer.addCard(this.decks.draw());

    // this.player2.addHoleCard_others(holdCard);
    // this.player2.addHoleCard_others(holdCard);


    // let audio = this.audioMng.getComponent("audioMng");
    // audio.playCard();
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
      let Dealer = this.dealer.getComponent("Dealer");
      Dealer.revealHoldCard();
      let inGameUI = this.inGameUI.getComponent("InGameUI");
      inGameUI.showResultState();

      let outcome = this._getPlayerResult(this.player, Dealer);
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

  onRestart(){
    this.start();
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
