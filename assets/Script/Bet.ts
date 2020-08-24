const { ccclass, property } = cc._decorator;
//let Game = require('Game');
import Game from "./Game";
@ccclass
export default class Bet extends cc.Component {

    @property(cc.Prefab)
    chipPrefab: cc.Prefab = null;

    @property([cc.Node])
    btnChips: cc.Node[] = [];

    @property([cc.Integer])
    chipValues: String[] = [];

    @property(cc.Node)
    anchorChipToss: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    // use this for initialization
    init() {
        this._registerBtns();
    }

    _registerBtns() {
        let game = Game.getInstance();
        let self = this;
        let registerBtn = function (index) {
            self.btnChips[i].on('touchstart', function (event) {
                if (game.addStake(self.chipValues[index])) {
                    self.playAddChip();
                }
            }, this);
        };
        for (var i = 0; i < self.btnChips.length; ++i) {
            registerBtn(i);
        }
    }

    playAddChip() {
        let startPos = cc.v2((Math.random() - 0.5) * 2 * 50, (Math.random() - 0.5) * 2 * 50);
        let chip = cc.instantiate(this.chipPrefab);
        this.anchorChipToss.addChild(chip);
        chip.setPosition(startPos);
        chip.getComponent('TossChip').play();
    }

    resetChips() {
        let game = Game.getInstance();
        game.resetStake();
        game.info.enabled = false;
        this.resetTossedChips();
    }

    resetTossedChips() {
        this.anchorChipToss.removeAllChildren();
    }
    // update (dt) {}
}
