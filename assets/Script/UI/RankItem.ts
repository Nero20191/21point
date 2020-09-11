
const { ccclass, property } = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {
  @property(cc.Sprite)
  spRankBG: cc.Sprite = null;

  @property(cc.Label)
  labelRank: cc.Label = null;

  @property(cc.Label)
  labelPlayerName: cc.Label = null;

  @property(cc.Label)
  labelGold: cc.Label = null;

  @property(cc.Sprite)
  spPlayerPhoto: cc.Sprite = null;

  @property(cc.SpriteFrame)
  texRankBG: cc.SpriteFrame;

  @property(cc.SpriteFrame)
  texPlayerPhoto: cc.SpriteFrame;
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  // use this for initialization
  init(rank: number, playerInfo) {
    if (rank < 3) {
      // should display trophy
      this.labelRank.node.active = false;
      this.spRankBG.spriteFrame = this.texRankBG[rank];
    } else {
      this.labelRank.node.active = true;
      this.labelRank.string = (rank + 1).toString();
    }

    this.labelPlayerName.string = playerInfo.name;
    this.labelGold.string = playerInfo.gold.toString();
    this.spPlayerPhoto.spriteFrame = this.texPlayerPhoto[playerInfo.photoIdx];
  }
  // update (dt) {}
}
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         spRankBG: cc.Sprite,
//         labelRank: cc.Label,
//         labelPlayerName: cc.Label,
//         labelGold: cc.Label,
//         spPlayerPhoto: cc.Sprite,
//         texRankBG: cc.SpriteFrame,
//         texPlayerPhoto: cc.SpriteFrame
//         // ...
//     },

//     // use this for initialization
//     init: function (rank: number, playerInfo: { name: any; gold: { toString: () => any; }; photoIdx: string | number; }) {
//         if (rank < 3) { // should display trophy
//             this.labelRank.node.active = false;
//             this.spRankBG.spriteFrame = this.texRankBG[rank];
//         } else {
//             this.labelRank.node.active = true;
//             this.labelRank.string = (rank + 1).toString();
//         }

//         this.labelPlayerName.string = playerInfo.name;
//         this.labelGold.string = playerInfo.gold.toString();
//         this.spPlayerPhoto.spriteFrame = this.texPlayerPhoto[playerInfo.photoIdx];
//     },

//     // called every frame
//     update: function (dt: any) {

//     },
// });
