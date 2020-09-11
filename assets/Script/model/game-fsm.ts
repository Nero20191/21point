import State = require("state.js");

let instance: any;
let model: any;
let playing: any;

function on(message) {
  return function (msgToEvaluate) {
    return msgToEvaluate === message;
  };
}
let evaluating = false;
const { ccclass, property } = cc._decorator;

@ccclass
class GameFsm extends cc.Component {
  public static instance = new GameFsm();
  init(target) {
    // send log messages, warnings and errors to the console
    State.console = console;

    //创建状态机root元素
    model = new State.StateMachine("root");
    let initial = new State.PseudoState(
      "init-root",
      model,
      State.PseudoStateKind.Initial
    );

    // 当前这一把的状态

    let bet = new State.State("下注", model);
    playing = new State.State("已开局", model);
    let settled = new State.State("结算", model);

    // create the state machine model transitions
    initial.to(bet);
    bet.to(playing).when(on("deal"));
    playing.to(settled).when(on("end"));
    settled.to(bet).when(on("bet"));

    bet.entry(function () {
      target.onBetState(true);
    });
    bet.exit(function () {
      target.onBetState(false);
    });

    settled.entry(function () {
      target.onEndState(true);
    });
    settled.exit(function () {
      target.onEndState(false);
    });

    // 开局后的子状态

    var initialP = new State.PseudoState(
      "init 已开局",
      playing,
      State.PseudoStateKind.Initial
    );
    var deal = new State.State("发牌", playing);
    //var postDeal = new State.State("等待", playing);    // 询问玩家是否买保险，双倍、分牌等
    var playersTurn = new State.State("玩家决策", playing);
    var dealersTurn = new State.State("庄家决策", playing);

    initialP.to(deal);
    deal.to(playersTurn).when(on("dealed"));
    playersTurn.to(dealersTurn).when(on("player acted"));

    deal.entry(function () {
      target.onEnterDealState();
    });
    playersTurn.entry(function () {
      target.onPlayersTurnState(true);
    });
    playersTurn.exit(function () {
      target.onPlayersTurnState(false);
    });
    dealersTurn.entry(function () {
      target.onEnterDealersTurnState();
    });

    // create a State machine instance
    instance = new State.StateMachineInstance("fsm");
    // initialise the model and instance
    State.initialise(model, instance);
  }

  toDeal() {
    this._evaluate("deal");
  }
  toBet() {
    this._evaluate("bet");
  }
  onDealed() {
    this._evaluate("dealed");
  }
  onPlayerActed() {
    this._evaluate("player acted");
  }
  onDealerActed() {
    this._evaluate("end");
  }

  _evaluate(message) {
    if (evaluating) {
      // can not call fsm's evaluate recursively
      setTimeout(function () {
        // send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
        State.evaluate(model, instance, message);
      }, 1);

      return;
    }
    evaluating = true;
    State.evaluate(model, instance, message);
    evaluating = false;
  }

  _getInstance() {
    return instance;
  }

  _getModel() {
    return model;
  }
}
let Fsm = GameFsm.instance;
export { Fsm };
