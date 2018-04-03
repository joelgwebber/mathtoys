///<reference path='Toy.ts'/>
///<reference path='BeadFrame.ts'/>
///<reference path='Expression.ts'/>

module mt {

  abstract class SimpleArithmetic implements Toy {
    private _obj: PIXI.Container;
    private _frame: BeadFrame;
    private _expr: Expression;

    constructor(parent: PIXI.Container) {
      parent.addChild(this._obj = new PIXI.Container());

      this._frame = this.makeFrame();
      this._frame.object().x = 200;

      this._expr = new Expression(this._obj, () => { this.nextQuestion(); });
      this._expr.object().x = 0;
      this._expr.object().y = 200;
      this.nextQuestion();
    }

    object(): PIXI.Container {
      return this._obj;
    }

    keyPress(code: number): boolean {
      if ((code >= 0x30) && (code <= 0x39)) {
        this._expr.input(code - 0x30);
        return true;
      } else if (code == 0x08) {
        this._expr.backspace();
        return true;
      }
      return false;
    }

    protected abstract makeFrame(): BeadFrame;
    protected abstract nextQuestion(): void;

    protected ask(left: number, right: number, op: number): void {
      this._frame.reset();
      this._expr.init(left, right, op);
    }
  }

  // Addition from 0-10.
  export class SimpleAddition extends SimpleArithmetic {
    constructor(parent: PIXI.Container) {
      super(parent);
    }

    protected makeFrame(): BeadFrame {
      return new BeadFrame(this.object(), false, () => { });
    }

    protected nextQuestion() {
      let left = Math.floor(Math.random() * 10) + 1;
      let right = Math.floor(Math.random() * 10) + 1;
      this.ask(left, right, OpAdd);
    }
  }

  // Multiplication from 0-10.
  export class SimpleMultiplication extends SimpleArithmetic {
    constructor(parent: PIXI.Container) {
      super(parent);
    }

    protected makeFrame(): BeadFrame {
      return new BeadFrame(this.object(), true, () => { });
    }

    protected nextQuestion() {
      let left = Math.floor(Math.random() * 8) + 2;
      let right = Math.floor(Math.random() * 2) + 2;
      this.ask(left, right, OpMul);
    }
  }
}
