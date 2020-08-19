// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioMng extends cc.Component {

    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    loseAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    cardAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    buttonAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    chipsAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    
    start () {
    }
   
    playMusic (){
        cc.audioEngine.playMusic( this.bgm, true );
    }
    pauseMusic() {
        cc.audioEngine.pauseMusic();
    }
 
    resumeMusic() {
        cc.audioEngine.resumeMusic();
    }
 
    _playSFX(clip) {
        cc.audioEngine.playEffect( clip, false );
    }
 
    playWin() {
        this._playSFX(this.winAudio);
    }
 
    playLose() {
        this._playSFX(this.loseAudio);
    }
 
    playCard() {
        this._playSFX(this.cardAudio);
    }
 
    playChips() {
        this._playSFX(this.chipsAudio);
    }
 
    playButton() {
        this._playSFX(this.buttonAudio);
    }
    // update (dt) {}
}

 
