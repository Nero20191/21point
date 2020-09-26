const { ccclass, property } = cc._decorator;

import Actor from "./Actor";
//import * as Util from "./model/Util";
import { isBust, getMinMaxPoint, isMobile } from "./model/Util";
import Game from "./Game";
import {Outcome } from "./model/Type";

@ccclass
export default class Dealer extends Actor {
  @property({ override: true })
  get bestPoint() {
    let t = this;
    let cards: any = t.holeCard ? [t.holeCard].concat(t.cards) : t.cards;
    let minMax = getMinMaxPoint(cards);
    return minMax.max;
  }
  

  init() {
    super.init();
    //this.getComponent("ActorRenderer").initDealer();
    let renderer = this.getComponent("ActorRenderer");
    renderer.initDealer();
  }

  // 返回是否要牌
  wantHit() {
    let game = Game.getInstance();
    let bP = this.bestPoint;

    // 已经最大点数
    if (bP === 21) {
      return false;
    }

    // 不论抽到什么牌肯定不会爆，那就接着抽
    if (bP <= 21 - 10) {
      return true;
    }

    let player = game.player;
    let outcome = game._getPlayerResult(player, this);

    switch (outcome) {
      case Outcome.Win:
        return true;
      case Outcome.Lose:
        return false;
    }

    return this.bestPoint < 17;
  }
}
