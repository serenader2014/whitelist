var express = require('express');
var router = express.Router();
var http = require('http');

var target = require('../app').target;

/* GET home page. */
router.get('/', function(req, res) {

    var request = http.request(target, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            var data = JSON.parse(chunk);
             res.render('index', {classes: data});
        });
    });

    request.end();
});

module.exports = router;
