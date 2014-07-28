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
        var d = '';
        response.on('data', function (chunk) {
            d = d + chunk;
        });

        response.on('end', function () {
            var data = JSON.parse(d);
            res.render('index', {classes: data});
        });
    });

    request.end();
});


// function searchRequest (target, req, res, next) {
//     var requestSearch = http.request(target, function (responseSearch) {
//         responseSearch.on('data', function (rawData) {
//             var data = JSON.parse(rawData);
//             var ips = data.ip;
//             var ipData = [];
//             var products = data.product;
//             ips.forEach(function (item, i) {
//                 var requestIp = http.request(target+'/ip'+'?ip='+item, function(responseIp) {
    //                 responseIp.on('data', function (rawIp) {
    //                     var ipInfo = JSON.parse(rawIp);
    //                     ipData.push(ipInfo);
    //                     // console.log([i,ipData,ips.length-1]);
    //                     if (i === ips.length-2) {
    //                         // res.send(ipData);
    //                         // console.log(ipData);
    //                         res.render('search', {ips: ipData, products: products});
    //                     }
    //                 });
    //             });
    //             requestIp.end();
    //         });
    //     });
    // });

    // requestSearch.end();    
// }

router.get('/:class', function (req, res) {
    var className = req.params.class;
    var baseUrl = req.url.split('?')[0];
    var search = req.query.s;
    var sort = req.query.sort;
    if (search) {

    } else if (sort) {
        var requestSort = http.request(target+'/'+className+'?search='+sort+'%', function (responseSort) {
            var d = '';
            responseSort.on('data', function (rawSort) {
                d = d + rawSort;
            });

            responseSort.on('end', function () {
                var sortData = JSON.parse(d);
                var requestClass = http.request(target, function (responseClass) {
                    var d = '';
                    responseClass.on('data', function (rawClass) {
                        d = d + rawClass;
                    });

                    responseClass.on('end', function () {
                        var classes = JSON.parse(d);
                        res.render('sort', {classes: classes, product: sortData, url: decodeURIComponent(baseUrl), sort: sort});
                    });
                });
                requestClass.end();
            });
        });
        requestSort.end();
    } else {
        var requestProduct = http.request(target+'/'+className, function (responseProduct) {
            var d = '';
            responseProduct.on('data', function (rawProduct) {
                d = d + rawProduct;

            });

            responseProduct.on('end', function () {
                var product = JSON.parse(d); 
                var requestClass = http.request(target, function (responseClass) {
                    var d = '';
                    responseClass.on('data', function (rawClass) {
                        d = d + rawClass;
                    });

                    responseClass.on('end', function () {
                        var classes = JSON.parse(d);
                        res.render('class', {classes: classes, product: product, url: decodeURIComponent(baseUrl)});

                    });
                });
                requestClass.end();

            });
        });

        requestProduct.end();
    }


});


router.get('/:class/page/:num', function (req, res) {
    var className = req.params.class;
    var number = req.params.num - 1;
    var baseUrl = req.url.split('/page/')[0].split('?')[0];
    var requestProduct = http.request(target+'/'+className+'?offset='+number*100+'&limit=100', function (responseProduct) {
        var d = '';
        responseProduct.on('data', function (rawProduct) {
            d = d + rawProduct;
        });

        responseProduct.on('end', function () {
            var product = JSON.parse(d);
            var requestClass = http.request(target, function (responseClass) {
                var d1 = '';
                responseClass.on('data', function (rawClass) {
                    d1 = d1 + rawClass;
                });
                responseClass.on('end', function () {
                    var classes = JSON.parse(d1);
                    res.render('class', {classes: classes, product: product, url: decodeURIComponent(baseUrl), pageNum: req.params.num});
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
    var baseUrl = req.url.split('?')[0];
    if (productName !== 'page') {
        var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
            var d = '';
            responseProduct.on('data', function (rawProduct) {
                d = d + rawProduct;
            });

            responseProduct.on('end', function () {
                var product = JSON.parse(d.toString('utf8'));
                res.render('product', {product:product, url: decodeURIComponent(baseUrl)});

            });
        });

        requestProduct.end();
    }
});

router.get('/:class/:product/page/:num', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var num = req.params.num -1;
    var baseUrl = req.url.split('/page/')[0].split('?')[0];
    var requestProduct = http.request(target+'/'+className+'/'+productName+'?offset='+num*100+'&limit=100', function (responseProduct) {
        var d = '';
        responseProduct.on('data', function (rawProduct) {
            d = d + rawProduct;
        });

        responseProduct.on('end', function () {
            var product = JSON.parse(d);
            res.render('product', {product: product, url: decodeURIComponent(baseUrl), pageNum: req.params.num});
        });
    });

    requestProduct.end();
});

router.get('/:class/:product/:child', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var childName = req.params.child;
    var baseUrl = req.url.split('?')[0];
    var sidebarLink = req.url.split('/'+childName+'/')[0];
    var requestChild = http.request(target+'/'+className+'/'+productName+'/'+childName, function (responseChild) {
        var d = '';
        responseChild.on('data', function (rawChild) {
            d = d + rawChild;
        });

        responseChild.on('end', function () {
            var child = JSON.parse(d);
            var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
                var d1 = '';
                responseProduct.on('data', function (rawProduct) {
                    d1 = d1 + rawProduct;
                });

                responseProduct.on('end', function () {
                    var product = JSON.parse(d1);
                    res.render('child', {child: child, product: product, url: decodeURIComponent(baseUrl), sidebarLink: decodeURIComponent(sidebarLink)});
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
    var baseUrl = req.url.split('?')[0];
    var sidebarLink = req.url.split(childName)[0];
    var num = req.params.num-1;
    var requestChild = http.request(target+'/'+className+'/'+productName+'/'+childName+'?offset='+num*100+'&limit=100', function (responseChild) {
        var d = '';
        responseChild.on('data', function (rawChild) {
            d = d + rawChild;
        });

        requestChild.on('end', function () {
            var child = JSON.parse(d);
            var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
                var d1 = '';
                responseProduct.on('data', function (rawProduct) {
                    d1 = d1 + rawProduct;
                });

                responseProduct.on('end', function () {
                    var product = JSON.parse(d1);
                    res.render('child', {child: child, product: product, url: decodeURIComponent(baseUrl), sidebarLink: decodeURIComponent(sidebarLink), pageNum: req.params.num});
                });
            });

            requestProduct.end();

        });
    }) ;  
    requestChild.end();    
});



module.exports = router;
