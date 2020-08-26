const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    
    //nodes
    @property(cc.Label) point : cc.Label = null;
 
    @property(cc.Sprite) suit : cc.Sprite = null;
 
    @property(cc.Sprite) mainPic: cc.Sprite = null;
    
    @property(cc.Sprite) cardBG: cc.Sprite = null;
 
    // resources
    @property(cc.Color.WHITE) 
    redTextColor: cc.Color = cc.Color.WHITE;
 
    @property(cc.Color.WHITE) blackTextColor: cc.Color = cc.Color.WHITE;
 
    @property(cc.SpriteFrame) texFrontBG: cc.SpriteFrame = null;
 
    @property(cc.SpriteFrame) texBackBG: cc.SpriteFrame = null;
 
    @property([cc.SpriteFrame]) 
    texFaces: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame]) 
    texSuitBig: cc.SpriteFrame[] = [];
    
    @property([cc.SpriteFrame]) 
    texSuitSmall: cc.SpriteFrame[] = [];    
    

    // onLoad () {}

    start () {

    }
    init(card: { point: number; suit: number; pointName: string; isRedSuit: any; }){
        let isFaceCard : boolean = card.point > 10;

        console.log("Card init!")
        if (isFaceCard) {
            this.mainPic.spriteFrame = this.texFaces[card.point - 10 - 1];
        }
        else {
            this.mainPic.spriteFrame = this.texSuitBig[card.suit - 1];
        }

        // for jsb
        this.point.string = card.pointName;

        if (card.isRedSuit) {
            this.point.node.color = this.redTextColor;
        }
        else {
            this.point.node.color = this.blackTextColor;
        }

        this.suit.spriteFrame = this.texSuitSmall[card.suit - 1];
    }

    reveal(isFaceUp: boolean) {
        this.point.node.active = isFaceUp;
        this.suit.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    }
    update (dt: any) {}
}
