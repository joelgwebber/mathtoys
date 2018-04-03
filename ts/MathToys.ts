///<reference path='SimpleArithmetic.ts'/>
///<reference path='pixi.js.d.ts'/>

module mt {

  import Px = PIXI;
  import Loaders = Px.loaders;
  import WebGLRenderer = PIXI.WebGLRenderer;

  let _renderer: Px.SystemRenderer;
  let _root: Px.Container;
  let _curToy: Toy;

  export function main() {
    _renderer = Px.autoDetectRenderer(1000, 1000, {
      backgroundColor: 0xffffff,
      autoResize: true
    });

    document.body.appendChild(_renderer.view);
    _root = new Px.Container();
    _curToy = new SimpleAddition(_root);

    window.addEventListener("keydown", (e) => {
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      if (_curToy.keyPress(e.keyCode)) {
        e.preventDefault();
      }
    }, true);

    // Kick off the rendering loop.
    animate();
  }

  export function log(...args: any[]) {
    console.log.apply(this, args)
  }

  // Rendering loop.
  function animate() {
    requestAnimationFrame(animate);
    _renderer.resize(window.innerWidth, window.innerHeight);
    _renderer.render(_root);
  }
}

mt.main();
