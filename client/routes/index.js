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
    var requestProduct = http.request(target+'/'+className, function (responseProduct) {
        responseProduct.on('data', function (rawProduct) {
            var product = JSON.parse(rawProduct);
            var requestClass = http.request(target, function (responseClass) {
                responseClass.on('data', function (rawClass) {
                    var classes = JSON.parse(rawClass);
                    res.render('class', {classes: classes, product: product});
                    // console.log([classes, product]);
                });
            });

            requestClass.end();
        });
    });

    requestProduct.end();
});

router.get('/:class/:product', function (req, res) {
    var className = req.params.class;
    var productName = req.params.productName;
    var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
        responseProduct.on('data', function (rawProduct) {
            var product = JSON.parse(rawProduct);

            res.render('product', {product:product});
        });
    });

    requestProduct.end();
});

router.get('/:class/:product/:child', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var childName = req.params.child;
    var requestChild = http.request(target+'/'+className+'/'+productName+'/'+childName, function (responseChild) {
        responseChild.on('data', function (rawChild) {
            var child = JSON.parse(rawChild);
            var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
                responseProduct.on('data', function (rawProduct) {
                    var product = JSON.parse(rawProduct);
                    res.render('child', {child: child, product: product});
                });
            });

            requestProduct.end();
        });
    }) ;  
    requestChild.end();
});


module.exports = router;
