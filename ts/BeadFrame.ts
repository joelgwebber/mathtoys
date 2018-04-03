module mt {

  const BeadRadius = 4;
  const BeadColor1 = 0x0000ff;
  const BeadColor2 = 0xff00ff;

  const NumberTextStyle: PIXI.TextStyle = {
    fontFamily: "Courier",
    fontSize: BeadRadius * 2,
    align: "left"
  };

  function beadColor(row: number, col: number): number {
    if ((row < 0) || (col < 0)) {
      return 0xffffff;
    }

    if (row < 5) {
      return (col < 5) ? BeadColor1 : BeadColor2;
    } else {
      return (col < 5) ? BeadColor2 : BeadColor1;
    }
  }

  function beadPos(n: number): number {
    return (n+0.5) * 10;
  }

  class BeadRow implements Control {
    private _obj: PIXI.Container;
    private _gfx: PIXI.Graphics;
    private _beads: PIXI.Graphics[] = [];
    private _number: PIXI.Text;
    private _value = 0;

    constructor(parent: PIXI.Container, row: number, private _onChange: () => void) {
      parent.addChild(this._obj = new PIXI.Container());
      this._obj.addChild(this._gfx = new PIXI.Graphics());

      this._gfx.lineStyle(1, 0x000000);
      this._gfx.moveTo(0, 0);
      this._gfx.lineTo(205, 0);

      this._number = new PIXI.Text("0", NumberTextStyle);
      this._number.x = 210; this._number.y = 0;

      let clicker = (n: number) => {
        return (obj: PIXI.DisplayObject) => { this.onBeadClick(n) };
      };

      for (let n = 0; n < 10; n++) {
        let bead = new PIXI.Graphics();
        bead.width = BeadRadius * 2; bead.height = BeadRadius * 2;
        this._obj.addChild(bead);

        bead.beginFill(beadColor(row, n));
        bead.lineStyle(1, 0x000000);
        bead.drawCircle(BeadRadius, BeadRadius, BeadRadius);
        bead.endFill();
        bead.defaultCursor = "pointer";
        bead.x = this.beadX(n); bead.y = -BeadRadius;

        bead.interactive = true;
        bead.on("mousedown", clicker(n));
        this._beads.push(bead);
      }
    }

    object(): PIXI.Container {
      return this._obj;
    }

    value(): number {
      return this._value;
    }

    setValue(n: number) {
      if (n == this._value) {
        return;
      }
      this._value = n;
      this._number.text = "" + n;
      for (let n = 0; n < 10; n++) {
        // TODO: this._beads[n].animate(250, "<>").cx(this.beadX(n));
        this._beads[n].x = this.beadX(n);
      }
      this._onChange();
    }

    private onBeadClick(n: number) {
      this.setValue(n >= this._value ? n + 1 : n);
    }

    private beadX(n: number): number {
      return (n >= this._value ? 100 : 5) + beadPos(n) - BeadRadius;
    }
  }

  class BeadEdge implements Control {
    private _obj: PIXI.Container;
    private _beads: PIXI.Graphics[] = [];
    private _value = 0;

    constructor(parent: PIXI.Container, vertical: boolean, private _onChange: () => void) {
      parent.addChild(this._obj = new PIXI.Container());

      let clicker = (n: number) => {
        return (obj: PIXI.DisplayObject) => { this.setValue(n); };
      };

      for (let n = -1; n < 10; n++) {
        let bead = new PIXI.Graphics();
        bead.width = BeadRadius * 2; bead.height = BeadRadius * 2;
        this._obj.addChild(bead);

        bead.beginFill(beadColor(0, n));
        bead.lineStyle(1, 0x000000);
        bead.drawRect(0, 0, BeadRadius * 2, BeadRadius * 2);
        bead.endFill();
        bead.defaultCursor = "pointer";

        if (vertical) {
          bead.y = beadPos(n) - BeadRadius; bead.x = -BeadRadius * 3;
        } else {
          bead.x = beadPos(n) - BeadRadius; bead.y = -BeadRadius * 3;
        }

        bead.interactive = true;
        bead.on("mousedown", clicker(n + 1));
        this._beads.push(bead);
      }

      this.setValue(0);
    }

    object(): PIXI.Container {
      return this._obj;
    }

    value(): number {
      return this._value;
    }

    setValue(n: number) {
      // TODO this._beads[this._value].stroke("black");
      if (n != this._value) {
        this._value = n;
        this._onChange();
      }
      // TODO this._beads[this._value].stroke("#ccc");
    }
  }

  export class BeadFrame implements Control {
    private _obj: PIXI.Container;
    private _rows: BeadRow[] = [];
    private _topEdge: BeadEdge;
    private _leftEdge: BeadEdge;
    private _value = 0;

    constructor(parent: PIXI.Container, private _rect: boolean, private _onChange: () => void) {
      parent.addChild(this._obj = new PIXI.Container());
      this._obj.x = 100;
      this._obj.y = 55;
      this._obj.scale.x = 4;
      this._obj.scale.y = 4;

      let rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000);
      rect.drawRect(0, 0, 205, 110);
      this._obj.addChild(rect);

      let updateFromEdges = () => {
        let r = 0;
        for (; r < this._leftEdge.value(); r++) {
          this._rows[r].setValue(this._topEdge.value());
        }
        for (; r < this._rows.length; r++) {
          this._rows[r].setValue(0);
        }
      };

      this._topEdge = new BeadEdge(this._obj, false, updateFromEdges);
      this._leftEdge = new BeadEdge(this._obj, true, updateFromEdges);
      this._topEdge.object().x = 5;
      this._leftEdge.object().y = 5;

      for (let r = 0; r < 10; r++) {
        this.addRow(r);
      }
    }

    object(): PIXI.Container {
      return this._obj;
    }

    value(): number {
      return this._value;
    }

    reset(): void {
      this._topEdge.setValue(0);
      this._leftEdge.setValue(0);
      this._rows.forEach((row) => { row.setValue(0); });
    }

    private addRow(r: number) {
      let row = new BeadRow(this._obj, r, () => {
        this.updateTotal();
      });
      row.object().y = (r+1) * 10;
      this._rows.push(row);
    }

    private updateTotal() {
      this._value = 0;
      for (let i = 0; i < this._rows.length; i++) {
        this._value += this._rows[i].value();
      }
      this._onChange();
    }
  }
}