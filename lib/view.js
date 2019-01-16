'use strict';

const template = require('art-template');
const path = require('path');
const fs = require('mz/fs');
const assert = require('assert');

class LocalArtView {
  constructor(ctx) {
    const {view, localart, art} = ctx.app.config;
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = art;
    this.root = view.root;
    this.ingorePath = localart && localart.ignorePath;
  }

  render(filename, locals, viewOptions) {
    if (typeof this.ingorePath === 'string' && this.ingorePath) {
      this.ingorePath = [ this.ingorePath ];
    }

    if (Object.prototype.toString.call(this.ingorePath) === '[object Array]') {
      const isIngore = this.ingorePath.some(p => {
        if(p instanceof RegExp) {
          return p.test(filename);
        }
        return p === filename;
      });
      if (isIngore) return this.ingoreRender(filename, locals, viewOptions);
    }

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

  ingoreRender(filename, locals, viewOptions) {
    filename = path.join(this.root[0], filename);
    filename = filename.endsWith('.html') ? filename : `${filename}.html`;
    assert(fs.existsSync(filename), `Can't find ${filename}`);
    let options = Object.assign({}, this.config, viewOptions, { filename });
    return Promise.resolve(template.compile(options)(locals));
  }

  renderString() {}
}

module.exports = LocalArtView;
