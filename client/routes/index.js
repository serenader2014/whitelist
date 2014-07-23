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

router.get('/:class', function (req, res) {
    var className = req.params.class;
    var request = http.request(target+className, function (response) {
        response.on('data', function (chunk) {
            var data = JSON.parse(chunk);
            var requestClass = http.request(target, function (responseClass) {
                responseClass.on('data', function (chunk) {
                    var classes = JSON.parse(chunk);
                    res.render('class', {classes: classes, product: data});
                });
            });
        });
    });
});

module.exports = router;
