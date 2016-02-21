'use strict';

//var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var UrlShortener = require(process.cwd() + '/app/controllers/urlShortener.server.js');

module.exports = function (app, db) {
   //var clickHandler = new ClickHandler(db);
   var urlShortener = new UrlShortener(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });

   // app.route('/api/clicks')
   //    .get(clickHandler.getClicks)
   //    .post(clickHandler.addClick)
   //    .delete(clickHandler.resetClicks);
   
   app.route('/new/*')
      .get(urlShortener.addUrl);
      
   app.route('/*')
      .get(urlShortener.getUrl);
};
