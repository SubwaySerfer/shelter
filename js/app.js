'use strict';

(function () {
  function init() {
    let router = new Router([
      new Route('main', 'main.html', true),
      new Route('pets', 'pets.html'),
    ]);
  }
  init();
})();
