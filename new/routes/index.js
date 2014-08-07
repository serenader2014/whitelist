var express = require('express');
var router = express.Router();
var http = require('http');

var target = require('../app').target;


router.get('/*', function (req, res, next) {
    var url = req.url.split('?')[0];
    var sort = req.query.sort;
    var page = req.query.page;
    var search = req.query.search;
    var arr;
    if (url === '/') {
        handleIndex();
    } else if (url.substring(url.length-1) === '/') {
        handleRedirect();
    }

    function handleRedirect () {
        res.redirect(url.substring(0, url.length-1));
    }

    function handleIndex () {

    }

    function handleClass () {
        arr = [url.substring(1), ''];
    }

    function handleProduct () {
        arr = handleUrl(url);
    }

    if (url.split('/').length ===2) {
        handleClass();
    } else {
        handleProduct();
    }
    var arrLength = arr.length;
    var j = 0;
    var result = [];

    function request (t) {
        var r = http.request(target + '/' + t, function (response) {
            var d = '';
            response.on('data', function (chunk) {
                d = d + chunk;
            });

            response.on('end', function () {
                try {
                    d = JSON.parse(d);
                    result.push(d);
                    j = j + 1;
                }
                catch (err) {
                    res.send([d, target+'/'+t]);
                    return false;
                }
                if (j <= arr.length-1) {
                    request(arr[j]);
                } else {
                    if (req.url.split('/').length === 2) {
                        res.render('class', {
                            classes: result[1], 
                            product: result[0], 
                            url: decodeURIComponent(req.url.split('?')[0]), 
                            sort: sort, 
                            pageNum: page,
                            search: search                            
                        });
                        // res.send(result);
                    } else {
                        var current = result[0];
                        var parents = [];
                        for (var i = 1; i < result.length; i++) {
                            parents[i-1] = result[i];
                        }
                        parents.reverse();
                        var a = [];
                        current.ip.forEach(function (item) {
                            a.push(item.value);
                        });
                        a.sort(function (str1, str2) {
                            var arr1 = str1.split('.');
                            var arr2 = str2.split('.');
                            var num1 = arr1[0];
                            var num2 = arr2[0];
                            if (num1 < num2) {
                                return -1;
                            } else if (num1 > num2) {
                                return 1;
                            } else {
                                num1 = arr1[1];
                                num2 = arr2[1];
                                if (num1 < num2) {
                                    return -1;
                                } else if (num1 > num2) {
                                    return 1;
                                } else {
                                    num1 = arr1[2];
                                    num2 = arr2[2];
                                    if (num1 < num2) {
                                        return -1;
                                    } else if (num1 > num2) {
                                        return 1;
                                    } else {
                                        num1 = arr1[3];
                                        num2 = arr2[3];
                                        if (num1 < num2) {
                                            return -1;
                                        } else if (num1 > num2) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                }
                            }
                        });
                        res.render('index', {urlArr: arr, current: current, parents: parents, ips: a});
                        // res.send([result,arr]);
                    }
                }
            });
        });
        r.end();
    }

    request(arr[j]);


    function handleUrl (url) {
        var arr = [];
        var urls = url.split('/');
        urls.shift();
        var length = urls.length;
        for (var i = 0; i < length; i++) {
            arr.push(urls.join('/'));
            urls.splice(-1,1);
        }

        return arr;
    }
});
module.exports = router;

