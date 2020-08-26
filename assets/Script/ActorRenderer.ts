const { ccclass, property } = cc._decorator;

import Game from "./Game";
import { CardType, Card, ActorPlayingState, Hand, Outcome } from "./model/Type";
import { isBust, getMinMaxPoint, isMobile } from "./model/Util";

@ccclass
export default class ActorRenderer extends cc.Component {
  @property(cc.Node)
  playerInfo: cc.Node = null;

  @property(cc.Node)
  stakeOnTable: cc.Node = null;

  @property(cc.Node)
  cardInfo: cc.Node = null;

  @property(cc.Prefab)
  cardPrefab: cc.Prefab = null;

  @property(cc.Node)
  anchorCards: cc.Node = null;

  @property(cc.Sprite)
  spPlayerName: cc.Sprite = null;

  @property(cc.Label)
  labelPlayerName: cc.Label = null;

  @property(cc.Label)
  labelTotalStake: cc.Label = null;

  @property(cc.Sprite)
  spPlayerPhoto: cc.Sprite = null;

  @property(cc.ProgressBar)
  callCounter: cc.ProgressBar = null;

  @property(cc.Label)
  labelStakeOnTable: cc.Label = null;

  @property([cc.Sprite])
  spChips: cc.Sprite[] = [];

  @property(cc.Label)
  labelCardInfo: cc.Label = null;

  @property(cc.Sprite)
  spCardInfo: cc.Sprite = null;

  @property(cc.Node)
  animFX: cc.Node = null;

  @property
  cardSpace = 0;

  actor: any;
  isCounting: boolean;
  counterTimer: number;
  turnDuration: any;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {}

  init(
    playerInfo: { name: string; gold: any; photoIdx: number },
    playerInfoPos: cc.Vec3,
    stakePos: cc.Vec3,
    turnDuration: any,
    switchSide: any
  ) {
    let game = Game.getInstance();
    // actor
    this.actor = this.getComponent("Actor");
    // nodes
    this.isCounting = false;
    this.counterTimer = 0;
    this.turnDuration = turnDuration;

    this.playerInfo.position = playerInfoPos;
    this.stakeOnTable.position = stakePos;
    this.labelPlayerName.string = playerInfo.name;
    this.updateTotalStake(playerInfo.gold);
    let photoIdx = playerInfo.photoIdx % 5;
    this.spPlayerPhoto.spriteFrame = game.assetMng.getComponent(
      "AssetMng"
    ).playerPhotos[photoIdx];
    // fx
    let animFX = this.animFX.getComponent("FXPlayer");
    animFX.init();
    animFX.show(false);

    this.cardInfo.active = false;

    // switch side
    if (switchSide) {
      this.spCardInfo.getComponent("SideSwitcher").switchSide();
      this.spPlayerName.getComponent("SideSwitcher").switchSide();
    }
  }

  update(dt: any) {
    if (this.isCounting) {
      this.callCounter.progress = this.counterTimer / this.turnDuration;
      this.counterTimer += dt;
      if (this.counterTimer >= this.turnDuration) {
        this.isCounting = false;
        this.callCounter.progress = 1;
      }
    }
  }

  initDealer() {
    // actor
    this.actor = this.getComponent("Actor");
    // fx
    let animFX = this.animFX.getComponent("FXPlayer");
    animFX.init();
    animFX.show(false);
  }

  updateTotalStake(num: string) {
    this.labelTotalStake.string = "$" + num;
  }

  startCountdown() {
    if (this.callCounter) {
      this.isCounting = true;
      this.counterTimer = 0;
    }
  }

  resetCountdown() {
    if (this.callCounter) {
      this.isCounting = false;
      this.counterTimer = 0;
      this.callCounter.progress = 0;
    }
  }

  playBlackJackFX() {
    this.animFX.getComponent("FXPlayer").playFX("blackjack");
  }

  playBustFX() {
    this.animFX.getComponent("FXPlayer").playFX("baopai");
  }

  onDeal(card: any, show: any) {
    let newCard = cc.instantiate(this.cardPrefab).getComponent("Card");
    this.anchorCards.addChild(newCard.node);
    newCard.init(card);
    newCard.reveal(show);

    var startPos = cc.v2(0, 0);
    var index = this.actor.cards.length - 1;
    var endPos = cc.v2(this.cardSpace * index, 0);
    newCard.node.setPosition(startPos);
    this._updatePointPos(endPos.x);

    var moveAction = cc.moveTo(0.5, endPos);
    var callback = cc.callFunc(this._onDealEnd, this);
    newCard.node.runAction(cc.sequence(moveAction, callback));
  }

  _onDealEnd(target: any) {
    this.resetCountdown();
    if (this.actor.state === ActorPlayingState.Normal) {
      this.startCountdown();
    }
    this.updatePoint();
    // this._updatePointPos(pointX);
  }

  onReset() {
    this.cardInfo.active = false;

    this.anchorCards.removeAllChildren();

    this._resetChips();
  }

  onRevealHoldCard() {
    var card = cc.find("card", this.anchorCards).getComponent("Card");
    card.reveal(true);
    this.updateState();
  }

  updatePoint() {
    this.cardInfo.active = true;
    this.labelCardInfo.string = this.actor.bestPoint;

    switch (this.actor.hand) {
      case Hand.BlackJack:
        this.animFX.getComponent("FXPlayer").show(true);
        this.animFX.getComponent("FXPlayer").playFX("blackjack");
        break;
      case Hand.FiveCard:
        // TODO
        break;
    }
  }

  _updatePointPos(xPos: number) {
    // cc.log(this.name + ' card info pos: ' + xPos);
    this.cardInfo.setPosition(xPos + 50, 0);
  }

  showStakeChips(stake: number) {
    var chips = this.spChips;
    var count = 0;
    if (stake > 50000) {
      count = 5;
    } else if (stake > 25000) {
      count = 4;
    } else if (stake > 10000) {
      count = 3;
    } else if (stake > 5000) {
      count = 2;
    } else if (stake > 0) {
      count = 1;
    }
    for (var i = 0; i < count; ++i) {
      chips[i].enabled = true;
    }
  }

  _resetChips() {
    for (var i = 0; i < this.spChips.length; ++i) {
      this.spChips.enabled = false;
    }
  }

  updateState() {
    let game = Game.getInstance();
    switch (this.actor.state) {
      case ActorPlayingState.Normal:
        this.cardInfo.active = true;
        this.spCardInfo.spriteFrame = game.assetMng.getComponent(
          "AssetMng"
        ).texCardInfo;
        this.updatePoint();
        break;
      case ActorPlayingState.Bust:
        let min = getMinMaxPoint(this.actor.cards).min;
        this.labelCardInfo.string = "爆牌(" + min + ")";
        this.spCardInfo.spriteFrame = game.assetMng.getComponent(
          "AssetMng"
        ).texBust;
        this.cardInfo.active = true;
        let animFX = this.animFX.getComponent("FXPlayer");
        animFX.show(true);
        animFX.playFX("baopai");
        this.resetCountdown();
        break;
      case ActorPlayingState.Stand:
        var max = getMinMaxPoint(this.actor.cards).max;
        this.labelCardInfo.string = "停牌(" + max + ")";
        this.spCardInfo.spriteFrame = game.assetMng.getComponent(
          "AssetMng"
        ).texCardInfo;
        this.resetCountdown();
        // this.updatePoint();
        break;
    }
  }
}
