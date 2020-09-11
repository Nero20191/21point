const { ccclass, property } = cc._decorator;
enum CardType {
    Spade = 1,   // 黑桃
    Heart = 2,   // 红桃
    Club = 3,    // 梅花(黑)
    Diamond = 4, // 方块(红)
}
let CardPoint: any[] = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');


/**
 * 扑克牌类，只用来表示牌的基本属性，不包含游戏逻辑，所有属性只读，
 * 因此全局只需要有 52 个实例（去掉大小王），不论有多少副牌
 * @class Card
 * @constructor
 * @param {Number} point - 可能的值为 1 到 13
 * @param {CardType} suit
 */
function Card(point: number, suit: number) {
    Object.defineProperties(this, {
        point: {
            value: point,
            writable: false
        },
        suit: {
            value: suit,
            writable: false
        },
        /**
         * @property {Number} id - 可能的值为 0 到 51
         */
        id: {
            value: (suit - 1) * 13 + (point - 1),
            writable: false
        },
        //
        pointName: {
            get() {
                return CardPoint[this.point];
            }
        },
        suitName: {
            get() {
                return CardType[this.suit];
            }
        },
        isBlackSuit: {
            get() {
                return this.suit === CardType.Spade || this.suit === CardType.Club;
            }
        },
        isRedSuit: {
            get() {
                return this.suit === CardType.Heart || this.suit === CardType.Diamond;
            }
        },
    });
}

Card.prototype.toString = function () {
    return this.suitName + ' ' + this.pointName;
};

// 存放 52 张扑克的实例
let cards = new Array(52);

let cardArray: any[] = Array(52);

/**
 * 返回指定 id 的实例
 * @param {Number} id - 0 到 51
 */
Card.fromId = function (id: number) {
    return cards[id];
};

// 初始化所有扑克牌
(function createCards() {
    for (let s = 1; s <= 4; s++) {
        for (let p = 1; p <= 13; p++) {
            let card = new Card(p, s);
            cards[card.id] = card;
        }
    }
})();

// 手中牌的状态

enum ActorPlayingState {
    Normal = 0,
    Stand ,  // 停牌
    Report , // 报到
    Bust ,   // 爆了
}
// 输赢
enum Outcome {
    Win = 0,
    Lose ,
    Tie ,
}
// 牌型，值越大越厉害
enum Hand {
    Normal = 0,     // 无
    BlackJack ,  // 黑杰克
    FiveCard ,
}

export {
    CardType,
    Card,
    ActorPlayingState,
    Hand,
    Outcome,
}