module mt {

  export const OpAdd = 0;
  export const OpSub = 1;
  export const OpMul = 2;
  export const OpDiv = 3;

  const ExprTextStyle: PIXI.TextStyle = {
    fontFamily: "Courier",
    fontSize: 48,
    align: "right"
  };

  // TODO:
  // - Underline
  // - Right-align
  export class Expression implements Control {
    private _left: number;
    private _right: number;
    private _op: number;
    private _result = 0;

    private _obj: PIXI.Container;
    private _leftElem: PIXI.Text;
    private _rightElem: PIXI.Text;
    private _opElem: PIXI.Text;
    private _resultElem: PIXI.Text;

    constructor(parent: PIXI.Container, private _correct: () => void) {
      parent.addChild(this._obj = new PIXI.Container());

      this._obj.addChild(this._leftElem = new PIXI.Text("", ExprTextStyle));   this._leftElem.x   = 60; this._leftElem.y   =  0;
      this._obj.addChild(this._rightElem = new PIXI.Text("", ExprTextStyle));  this._rightElem.x  = 60; this._rightElem.y  = 48;
      this._obj.addChild(this._opElem = new PIXI.Text("", ExprTextStyle));     this._opElem.x     =  0; this._opElem.y     = 48;
      this._obj.addChild(this._resultElem = new PIXI.Text("", ExprTextStyle)); this._resultElem.x = 60; this._resultElem.y = 96;
    }

    object(): PIXI.DisplayObject {
      return this._obj;
    }

    input(x: number) {
      this._result *= 10;
      this._result += x;
      this.updateResult();

      if (this._result == this.answer()) {
        this._correct();
      }
    }

    backspace() {
      this._result = Math.floor(this._result / 10);
      this.updateResult();
    }

    init(left: number, right: number, op: number) {
      this._left = left;
      this._right = right;
      this._op = op;

      this._leftElem.text = "" + left;
      this._rightElem.text = "" + right;

      let opstr = "";
      switch (op) {
        case OpAdd: opstr = "+"; break;
        case OpSub: opstr = "-"; break;
        case OpMul: opstr = "×"; break;
        case OpDiv: opstr = "÷"; break;
        default: throw "unexpected operator";
      }
      this._opElem.text = opstr;

      // Clear result.
      this._result = 0;
      this.updateResult();
    }

    private answer(): number {
      switch (this._op) {
        case OpAdd: return this._left + this._right;
        case OpSub: return this._left - this._right;
        case OpMul: return this._left * this._right;
        case OpDiv: return this._left / this._right;
        default: throw "unexpected operator";
      }
    }

    private updateResult() {
      this._resultElem.text = this._result ? ("" + this._result) : "";
    }
  }
}
