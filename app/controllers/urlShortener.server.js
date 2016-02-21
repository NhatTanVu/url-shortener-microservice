'use strict';

var autoIncrement = require("mongodb-autoincrement");

function urlShortener (db) {
   var collectionName = 'urls';
   var urls = db.collection(collectionName);
   
   function composeShortenUrl(req, id) {
      var fullUrl = req.protocol + '://' + req.get('host');
      return fullUrl + "/" + id;
   }

   this.getUrl = function (req, res) {
      var param0 = req.params[0];
      
      console.log("**getURL**");
      console.log("params = " + JSON.stringify(req.params));
      if (/^[1-9]\d*$/.test(param0)) {
         var idParam = param0;
         var id = parseInt(idParam);
         
         if (!id) {
            return res.json({ "error":"No short url found for given input" });
         }
         
         urls.findOne({ '_id': id }, function (err, doc) {
            if (err) {
               throw err;
            }
   
            console.log("doc = " + JSON.stringify(doc));
            if (doc) {
               res.redirect(doc.originalUrl);
            } else {
               res.json({ "error":"No short url found for given input" });
            }
         });
      }
      else {
         res.json({ "error":"No short url found for given input" });
      }
   };

   this.addUrl = function (req, res) {
      var param0 = req.params[0];
      
      console.log("**addUrl**");
      console.log("params = " + JSON.stringify(req.params));
      if ( /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(param0) ) {
         var newUrlParam = param0;
   
         urls.find({ 'originalUrl': newUrlParam }).limit(1).next(function (err, doc) {
            if (err) {
               console.log("error = " + JSON.stringify(err));
               res.status(500).end();
            }
   
            console.log("doc = " + JSON.stringify(doc));
            if (doc) {
               res.json({ "original_url": newUrlParam, "short_url": composeShortenUrl(req, doc._id) });
            }
            else {
   
               autoIncrement.getNextSequence(db, collectionName, function (err, autoIndex) {
                  if (err) {
                     console.log("error = " + JSON.stringify(err));
                     res.status(500).end();
                  }
                  
                  console.log("autoIndex = " + autoIndex);
                  urls.insert({
                     _id: autoIndex,
                     "originalUrl": newUrlParam
                  }, function(err, doc) {
                     if(err) {
                        console.log("error = " + JSON.stringify(err));
                        res.status(500).end();                     
                     }
                     
                     res.json({ "original_url": newUrlParam, "short_url": composeShortenUrl(req, autoIndex) });
                  });
               });
            }
         });
      }
      else {
         res.json({ "error": "Invalid URL" });
      }
   };
}

module.exports = urlShortener;
