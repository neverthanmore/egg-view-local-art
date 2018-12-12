'use strict';

const template = require('art-template');

class LocalArtView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config.art;
  }

  render(filename, locals, viewOptions) {
    const options = Object.assign({}, this.config, viewOptions);

    filename = /^\//.test(filename) ? filename : `/${filename}`;
    const tplPromise = this.app.fileSystem.readWebpackMemoryFile(filename, 'localart');
    return new Promise(resolve => {
      tplPromise.then(content => {
        const render = template.compile(content, options);
        resolve(render(locals));
      });
    });
  }

  renderString() {}
}

module.exports = LocalArtView;
