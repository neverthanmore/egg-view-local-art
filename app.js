'use strict';

module.exports = app => {
  // use origin path
  if (app.view) {
    app.view.resolve = function(name) {
      return Promise.resolve(name);
    };
  }

  app.view.use('localart', require('./lib/view'));
};
