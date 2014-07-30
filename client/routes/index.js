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
            var data;
            try {
                data = JSON.parse(d);
            } catch (err) {
                res.send(d);
                return false;
            }
            res.render('index', {classes: data});
        });
    });

    request.end();
});

router.get('/:class', function (req, res) {
    var className =decodeURIComponent(req.params.class);
    var baseUrl = req.url.split('?')[0];
    var search = req.query.s;
    var sort = req.query.sort;
    var page = req.query.page;
    if (search) {
        handle(target+'/'+className+'?search='+search);
    } else if (page) {
        handle(target+'/'+className+'?offset='+(page-1)*100+'&limit=100');
    } else if (sort) {
        handle(target+'/'+className+'?search='+sort+'%');
    } else {
        handle(target+'/'+className);
    }

    function handle (url) {
        var requestProduct = http.request(url, function (responseProduct) {
            var d = '';
            responseProduct.on('data', function (rawProduct) {
                d = d + rawProduct;
            });

            responseProduct.on('end', function () {
                var product;
                try {
                    product = JSON.parse(d);
                }
                catch (err) {
                    res.send(d);
                    return false;
                }
                var requestClass = http.request(target, function (responseClass) {
                    var d = '';
                    responseClass.on('data', function (rawClass) {
                        d = d + rawClass;
                    });

                    responseClass.on('end', function () {
                        var classes;
                        try {
                            classes = JSON.parse(d);
                        }
                        catch (err) {
                            res.send(d);
                            return false;
                        }
                        res.render('class', {
                            classes: classes, 
                            product: product, 
                            url: decodeURIComponent(baseUrl), 
                            sort: sort, 
                            pageNum: page,
                            search: search
                        });

                    });
                });
                requestClass.end();

            });
        });

        requestProduct.end();
    }
});

router.get('/:class/:product', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var baseUrl = req.url.split('?')[0];
    var search = req.query.s;
    var sort = req.query.sort;

    if (sort) {
        handle(target+'/'+className+'/'+productName+'?search='+sort+'%');
    } else if (search) {
        handle(target+'/'+className+'/'+productName+'?search='+search);
    } else {
        handle(target+'/'+className+'/'+productName);
    }

    function handle (url) {
        var requestProduct = http.request(url, function (responseProduct) {
            var d = '';
            responseProduct.on('data', function (rawProduct) {
                d = d + rawProduct;
            });

            responseProduct.on('end', function () {
                var product;
                try {
                    product = JSON.parse(d);
                }
                catch (err) {
                    res.send(d);
                    return false;
                }
                res.render('product1', {
                    product:product, 
                    url: decodeURIComponent(baseUrl),
                    sort: sort,
                    search: search,
                    ip: product.ip,
                    current: product.current.name,
                    p: product.product,
                    letter: product.first_letter
                });

            });
        });

        requestProduct.end();
    }
});

router.get('/:class/:product/:child', function (req, res) {
    var className = req.params.class;
    var productName = req.params.product;
    var childName = req.params.child;
    var baseUrl = req.url.split('?')[0];
    var sidebarLink = req.url.split('/'+childName+'/')[0];
    var sort = req.query.sort;
    var search = req.query.s;


    if (sort) {
        handle(target+'/'+className+'/'+productName+'/'+childName+'?search='+sort+'%');
    } else if (search) {
        handle(target+'/'+className+'/'+productName+'/'+childName+'?search='+search);
    } else {
        handle(target+'/'+className+'/'+productName+'/'+childName);
    }

    function handle (url) {
        var requestChild = http.request(url, function (responseChild) {
            var d = '';
            responseChild.on('data', function (rawChild) {
                d = d + rawChild;
            });

            responseChild.on('end', function () {
                var child;
                try {
                    child = JSON.parse(d);
                }
                catch (err) {
                    res.send(d);
                    return false;
                }
                var requestProduct = http.request(target+'/'+className+'/'+productName, function (responseProduct) {
                    var d1 = '';
                    responseProduct.on('data', function (rawProduct) {
                        d1 = d1 + rawProduct;
                    });

                    responseProduct.on('end', function () {
                        var product;
                        try {
                            product = JSON.parse(d1);
                        }
                        catch (err) {
                            res.send(d1);
                            return false;
                        }
                        res.render('product1', {
                            child: child, 
                            product: product, 
                            url: decodeURIComponent(baseUrl), 
                            sidebarLink: decodeURIComponent(sidebarLink),
                            sort: sort,
                            search: search,
                            ip: child.ip,
                            current: child.current.name,
                            p: child.product,
                            letter: child.first_letter
                        });
                    });
                });
                requestProduct.end();
            });
        }) ;  
        requestChild.end();

    }
});

router.get('/:class/:product/:child/:subChild',function (req,res) {
    var className = req.params.class;
    var productName = req.params.product;
    var childName = req.params.child;
    var subChildName = req.params.subChild;
    var baseUrl = req.url.split('?');
    var sidebarLink = req.url.split('/'+subChildName+'/');
    var requestSubChild = http.request(target+'/'+className+'/'+productName+'/'+childName+'/'+subChildName,function (responseSubChild) {
        var d = '';
        responseSubChild.on('data',function (rawSubChild) {
            d = d + rawSubChild;
        });

        responseSubChild.on('end',function () {
            var subChild;
            try {
                subChild = JSON.parse(d);
            }
            catch (err) {
                res.send(d);
                return false;
            }
            var requestChild = http.request(target+'/'+className+'/'+productName+'/'+childName,function (responseChild) {
                var d1 = '';
                responseChild.on('data',function (rawChild) {
                    d1 = d1 + rawChild;
                });
    
                responseChild.on('end',function () {
                    var child;
                    try {
                        child = JSON.parse(d1);
                    }
                    catch (err) {
                        res.send(d1);
                        return false;
                    }
                    var requestProduct = http.request(target+'/'+className+'/'+productName,function (responseProduct) {
                        var d2 = '';
                        responseProduct.on('data',function (rawProduct) {
                            d2 = d2 + rawProduct;
                        });

                        responseProduct.on('end', function () {
                            var product;
                            try {
                                product = JSON.parse(d2);
                            }
                            catch (err) {
                                res.send(d2);
                                return false;
                            }
                            res.render('product1',{
                                subChild: subChild, 
                                child: child, 
                                product: product, 
                                url: decodeURIComponent(baseUrl),
                                sidebarLink: decodeURIComponent(sidebarLink),
                                ip: subChild.ip,
                                current: subChild.current.name,
                                p: subChild.product,
                                letter: subChild.first_letter
                            });
                        });
                    });
                    requestProduct.end();
                });
            });
            requestChild.end();
        });
    });
    requestSubChild.end();
});

module.exports = router;
