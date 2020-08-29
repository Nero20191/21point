// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// const {ccclass, property} = cc._decorator;




import {Card} from "./Type";
/**
 * 扑克管理类，用来管理一副或多副牌
 * @class Decks
 * @constructor
 * @param {number} numberOfDecks - 总共几副牌
 */
function Decks (numberOfDecks:number) {
    // 总共几副牌
    this._numberOfDecks = numberOfDecks;
    // 还没发出去的牌
    this._cardIds = new Array(numberOfDecks * 52);

    this.reset();
}

/**
 * 重置所有牌
 * @method reset
 */
Decks.prototype.reset = function () {
    this._cardIds.length = this._numberOfDecks * 52;
    let index = 0;
    let fromId = Card.fromId;
    for (let i = 0; i < this._numberOfDecks; ++i) {
        for (let cardId = 0; cardId < 52; ++cardId) {
            this._cardIds[index] = fromId(cardId);
            ++index;
        }
    }
};

/**
 * 随机抽一张牌，如果已经没牌了，将返回 null
 * @method draw
 * @return {Card}
 */
Decks.prototype.draw = function () {
    let cardIds = this._cardIds;
    let len = cardIds.length;
    if (len === 0) {
        return null;
    }

    let random = Math.random();
    let index = (random * len) | 0;
    let result = cardIds[index];

    // 保持数组紧凑
    let last = cardIds[len - 1];
    cardIds[index] = last;
    cardIds.length = len - 1;

    return result;
};

///**
// * 发一张牌
// * @method deal
// * @return {Card}
// */
//Decks.prototype.deal = function () {
//    this._cardIds.pop();
//};

///**
// * 洗牌
// * @method shuffle
// */
//Decks.prototype.shuffle = function () {
//    shuffleArray(this._cardIds);
//};
//
///**
// * Randomize array element order in-place.
// * Using Durstenfeld shuffle algorithm.
// * http://stackoverflow.com/a/12646864
// */
//function shuffleArray(array) {
//    for (var i = array.length - 1; i > 0; i--) {
//        var j = (Math.random() * (i + 1)) | 0;
//        var temp = array[i];
//        array[i] = array[j];
//        array[j] = temp;
//    }
//    return array;
//}
export{Decks}
// module.exports = Decks;
