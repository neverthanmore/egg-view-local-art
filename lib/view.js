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
    const posix = process.platform === 'win32' ? process.cwd().substr(0, 3) : '/';
    filename = /^\//.test(filename) ? filename : `${posix}${filename}`;
    filename = filename.endsWith('.html') ? filename : `${filename}.html`;
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
