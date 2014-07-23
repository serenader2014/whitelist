var express = require('express');
var router = express.Router();
var http = require('http');

var target = require('../app').target;



// TODO 
// 1. search feature 
// 2. pagination
// 3. error handling
// 4. sidebar list problem
// 5. 


/* GET home page. */

router.get('/*', function (req, res, next) {
    if (req.url === '/') {
        next();
        return;
    }
    if (req.url.substring(req.url.length-1) === '/') {
        res.redirect(req.url.substring(0, req.url.length-1));
    } else {
        next();
    }
});

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
                });
            });

            requestClass.end();
        });
    });

    requestProduct.end();
});

router.get('/:class/page/:num', function (req, res) {
    var className = req.params.class;
    var number = req.params.num - 1;
    var requestProduct = http.request(target+'/'+className+'?offset='+number*100+'&limit=100', function (responseProduct) {
        responseProduct.on('data', function (rawProduct) {
            var product = JSON.parse(rawProduct);
            var requestClass = http.request(target, function (responseClass) {
                responseClass.on('data', function (rawClass) {
                    var classes = JSON.parse(rawClass);
                    res.render('class', {classes: classes, product: product, url: decodeURIComponent(req.url)});
                });
            });

            requestClass.end();
        });
    });

    requestProduct.end();
});

router.get('/:class/:product', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
        responseProduct.on('data', function (rawProduct) {
            var product = JSON.parse(rawProduct);

            res.render('product', {product:product, url: decodeURIComponent(req.url)});
        });
    });

    requestProduct.end();
});

router.get('/:class/:product/page/:num', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var num = req.params.num -1;
    var requestProduct = http.request(target+'/'+className+'/'+productName+'?offset='+num*100+'&limit=100', function (responseProduct) {
        responseProduct.on('data', function (rawProduct) {
            var product = JSON.parse(rawProduct);
            res.render('product', {product: product, url: decodeURIComponent(req.url)});
        });
    });

    requestProduct.end();
});

router.get('/:class/:product/:child', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var childName = req.params.child;
    var sidebarLink = req.url.replace(childName,'');
    console.log(sidebarLink);
    var requestChild = http.request(target+'/'+className+'/'+productName+'/'+childName, function (responseChild) {
        responseChild.on('data', function (rawChild) {
            var child = JSON.parse(rawChild);
            var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
                responseProduct.on('data', function (rawProduct) {
                    var product = JSON.parse(rawProduct);
                    res.render('child', {child: child, product: product, url: decodeURIComponent(req.url), sidebarLink: decodeURIComponent(sidebarLink)});
                });
            });

            requestProduct.end();
        });
    }) ;  
    requestChild.end();
});

router.get('/:class/:product/:child/page/:num', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var childName = req.params.child;
    var sidebarLink = req.url.split(childName)[0];
    var num = req.params.num-1;
    var requestChild = http.request(target+'/'+className+'/'+productName+'/'+childName+'?offset='+num*100+'&limit=100', function (responseChild) {
        responseChild.on('data', function (rawChild) {
            var child = JSON.parse(rawChild);
            var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
                responseProduct.on('data', function (rawProduct) {
                    var product = JSON.parse(rawProduct);
                    res.render('child', {child: child, product: product, url: decodeURIComponent(req.url), sidebarLink: decodeURIComponent(sidebarLink)});
                });
            });

            requestProduct.end();
        });
    }) ;  
    requestChild.end();    
});



module.exports = router;
