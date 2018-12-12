# egg-view-local-art
local art-template view for egg-vuecli-webpack-dev-server

## install

```base
$ npm i egg-view-local-art --D
```

## Usage

```js
// {app_root}/config/plugin.local.js
exports.view = {
  enable: true,
  package: 'egg-view-local-art'
};
await this.ctx.render('/index.html', {})
```

