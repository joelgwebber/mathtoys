module mt {
  import Px = PIXI;

  export interface Control {
    object(): Px.DisplayObject;
  }

  export interface Toy extends Control {
    keyPress(code: number): boolean;
  }
}
