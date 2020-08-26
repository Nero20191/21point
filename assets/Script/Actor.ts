const { ccclass, property } = cc._decorator;

import { ActorPlayingState as _ActorPlayingState, Hand } from "./model/Type";
import { isBust, getMinMaxPoint, isMobile } from "./model/Util";
let ActorPlayingState = _ActorPlayingState;

@ccclass
export default class Actor extends cc.Component {
  @property({
    serializable: false,
    visible: false,
  })
  cards = [];

  @property({
    serializable: false,
    visible: false,
  })
  holeCard = null;

  ready: boolean;

  @property
  get bestPoint() {
    let minMax = getMinMaxPoint(this.cards);
    return minMax.max;
  }

  @property
  get hand() {
    let count = this.cards.length;
    if (this.holeCard) {
      ++count;
    }
    if (count >= 5) {
      return Hand.FiveCard;
    }
    if (count === 2 && this.bestPoint === 21) {
      return Hand.BlackJack;
    }
    return Hand.Normal;
  }

  @property({
    visible: false,
  })
  canReport = {
    get(): any {
      return this.hand !== Hand.Normal;
    },
  };

  @property(cc.Node)
  renderer: cc.Node = null;

  @property({
    serializable: false,
  })
  state: any = ActorPlayingState.Normal;
  get eventParam(): any {
    return this.state;
  }
  set eventParam(oldState: any) {
    this.notify(this.state);
    this.state = oldState;
  }
  notify(oldState: any) {
    if (this.state !== oldState) {
      this.getComponent("ActorRenderer").updateState();
    }
  }

  init() {
    this.ready = true;
    this.renderer = this.getComponent("ActorRenderer");
  }

  addCard(card: any) {
    let t = this;
    t.cards.push(card);
    t.getComponent("ActorRenderer").onDeal(card, true);

    let cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
    if (isBust(cards)) {
      this.state = ActorPlayingState.Bust;
    }
  }

  addHoleCard(card: any) {
    this.holeCard = card;
    this.getComponent("ActorRenderer").onDeal(card, false);
  }

  stand() {
    this.state = ActorPlayingState.Stand;
  }

  revealHoldCard() {
    if (this.holeCard) {
      this.cards.unshift(this.holeCard);
      this.holeCard = null;
      this.getComponent("ActorRenderer").onRevealHoldCard();
    }
  }

  // revealNormalCard() {
  //     this.onRevealNormalCard();
  // }

  report() {
    this.state = ActorPlayingState.Report;
  }

  reset() {
    this.cards = [];
    this.holeCard = null;
    // this.reported = false;
    this.state = ActorPlayingState.Normal;
    this.getComponent("ActorRenderer").onReset();
  }
}

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // 所有明牌
//         cards: {
//             default: [],
//             serializable: false,
//             visible: false
//         },
//         // 暗牌，demo 暂存
//         holeCard: {
//             default: null,
//             serializable: false,
//             visible: false
//         },

//         // 手上最接近 21 点的点数（有可能超过 21 点）
//         bestPoint: {
//             get: function () {
//                 var minMax = getMinMaxPoint(this.cards);
//                 return minMax.max;
//             }
//         },

//         // 牌型，不考虑是否爆牌
//         hand: {
//             get: function () {
//                 var count = this.cards.length;
//                 if (this.holeCard) {
//                     ++count;
//                 }
//                 if (count >= 5) {
//                     return Hand.FiveCard;
//                 }
//                 if (count === 2 && this.bestPoint === 21) {
//                     return Hand.BlackJack;
//                 }
//                 return Hand.Normal;
//             }
//         },

//         canReport: {
//             get: function () {
//                 return this.hand !== Hand.Normal;
//             },
//             visible: false
//         },

//         renderer: {
//             default: null,
//             type: cc.Node
//         },
//         state: {
//             default: ActorPlayingState.Normal,
//             notify: function (oldState) {
//                 if (this.state !== oldState) {
//                     this.renderer.updateState();
//                 }
//             },
//             type: ActorPlayingState,
//             serializable: false,
//         }
//     },

//     init: function () {
//         this.ready = true;
//         this.renderer = this.getComponent('ActorRenderer');
//     },

//     addCard: function (card) {
//         this.cards.push(card);
//         this.renderer.onDeal(card, true);

//         var cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
//         if (isBust(cards)) {
//             this.state = ActorPlayingState.Bust;
//         }
//     },

//     addHoleCard: function (card) {
//         this.holeCard = card;
//         this.renderer.onDeal(card, false);
//     },

//     stand: function () {
//         this.state = ActorPlayingState.Stand;
//     },

//     revealHoldCard: function () {
//         if (this.holeCard) {
//             this.cards.unshift(this.holeCard);
//             this.holeCard = null;
//             this.renderer.onRevealHoldCard();
//         }
//     },

//     // revealNormalCard: function() {
//     //     this.onRevealNormalCard();
//     // },

//     report: function () {
//         this.state = ActorPlayingState.Report;
//     },

//     reset: function () {
//         this.cards = [];
//         this.holeCard = null;
//         this.reported = false;
//         this.state = ActorPlayingState.Normal;
//         this.renderer.onReset();
//     }
// });
