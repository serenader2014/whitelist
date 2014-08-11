var express = require('express');
var router = express.Router();
var http = require('http');

var base = require('../app').target;
var target = base + '/ls';



router.get('/');

router.get('/single/*', function (req, res, next) {
    var targetUrl = target + '/' + req.url.split('/single/')[1];
    var requestSingle = http.request(targetUrl, function (response) {
        var data = '';
        response.on('data', function (chunk) {
            data = data + chunk;
        });

        response.on('end', function () {
            res.send(data);
        });
    });
    requestSingle.on('error', function (e) {
        res.send(e.message);
        return false;
    });

    requestSingle.end();

});

//请求每页的数据
router.get('/page/*',function (req,res,next) {
    var targetUrl = target + '/' + req.url.split('/page/')[1];
    var requestPage = http.request(targetUrl, function (response) {
        var data = '';
        response.on('data', function (chunk) {
            data = data + chunk;
        });

        response.on('end', function (){
            res.send(data);
        });
    });
    requestPage.on('error', function (e) {
        res.send(e.message);
        return false;
    });

    requestPage.end();
});

router.post('/set', function (req, res, next) {
    var type = req.body.type;
    var id = req.body.id;
    var value = req.body.description || req.body.safe;

    var targetUrl = req.body.description ? 
        base + '/set/' + type + '/' + id + '?remark=' + value : 
        base + '/set/' + type + '/' + id + '?safe=' +value;


    var requestUpdate = http.request(targetUrl, function (responseUpdate) {
        var data = '';
        responseUpdate.on('data', function (chunk) {
            data = data + chunk;
        });

        responseUpdate.on('end', function () {
            res.send(data);
        });
    });

    requestUpdate.end();
    requestUpdate.on('error', function (e) {
        res.send(e.message);
        return false;
    });

});

router.get('/*', function (req, res, next) {
    //  取出非query部分的URL
    var noQueryUrl = req.url.split('?')[0];

    // 取出整个URL，包括query部分
    var url = req.url;

    // 缓存query名称
    var sort = req.query.search && req.query.search.split('%').length === 2 ? 
        req.query.search.split('%')[0] : '';
    var page = req.query.page;
    var search = req.query.search;

    // 存放需要请求的地址
    var arr;
    var noQueryArr;

    // 如果请求根目录，则处理根目录页面
    if (url === '/') {
        handleIndex();
        return false;
    } else if (url.substring(url.length-1) === '/') {
        // 跳转
        handleRedirect();
    }

    function handleRedirect () {
        res.redirect(url.substring(0, url.length-1));
    }

    function handleIndex () {
        var requestHome = http.request(target+'/', function (responseHome) {
            var data = '';
            responseHome.on('data', function (chunk) {
                data = data + chunk;
            });

            responseHome.on('end', function () {
                try {
                    data = JSON.parse(data);
                    res.render('home', {classes: data});
                }
                catch (err) {
                    res.send([data,err]);
                    return false;
                }
            });
        });

        requestHome.on('error', function (err) {
            res.send(err);
            return false;
        });

        requestHome.end();
    }

    function handleClass () {
        arr = [url.substring(1), '', ''];
        noQueryArr = [noQueryUrl, '', ''];
    }

    function handleProduct () {
        arr = handleUrl(url);
        noQueryArr = handleUrl(noQueryUrl);
    }

    if (url.split('/').length ===2) {
        // 处理class页面，单独拿出来处理。
        handleClass();
    } else {
        // 处理Product页面。
        handleProduct();
    }
    var arrLength = arr.length;
    var j = 0;
    var result = [];

    function request (t) {
        var tUrl = encodeURIComponent(target + '/' + t);
        var r = http.request(target + '/' + t, function (response) {
            var d = '';
            response.on('data', function (chunk) {
                // 此时获得的只是数据片段，而不是完整数据。
                d = d + chunk;
            });

            response.on('end', function () {
                try {
                    // 尝试解析后端返回的数据。
                    d = JSON.parse(d);
                    // 结果存在数组中
                    result.push(d);
                    // j 用来判断是否需要进一步请求数据
                    j = j + 1;
                }
                catch (err) {
                    // 当无法解析后端返回的数据时抛错
                    res.send([d, target+'/'+t]);
                    return false;
                }
                // product 页面只需要请求 www.qq.com 这一级的数据以及以下的数据。不需要请求 class 这一级的数据
                if (j < arr.length-1) {
                    // 继续请求数据
                    request(arr[j]);
                } else {
                    // 如果是请求 class 页面 则单独渲染 class 页面
                    if (req.url.split('/').length === 2) {
                        res.render('class', {
                            classes: result[1], 
                            product: result[0], 
                            url: decodeURIComponent(req.url.split('?')[0]), 
                            sort: sort, 
                            pageNum: page,
                            search: search,
                        });
                    } else {
                        // 将最后一级的请求结果单独拿出来存放，
                        // 其余的存在一个数组。目的是方便侧边栏的展示
                        var current = result[0];
                        var parents = [];
                        for (var i = 1; i < result.length; i++) {
                            parents[i-1] = result[i];
                        }
                        parents.reverse();

                        // 默认将ip列表按权重排序
                        var a = [];
                        current.ip.forEach(function (item) {
                            a.push(item);
                        });
                        a.sort(function (str1, str2) {
                            var num1 = str1.weight*1;
                            var num2 = str2.weight*1;
                            if (num1 < num2) {
                                return 1;
                            } else if (num1 > num2) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });

                        res.render('index', {
                            urlArr: noQueryArr, 
                            current: current, 
                            parents: parents, 
                            ips: a, 
                            search: search,
                            sort: sort
                        });
                    }
                }
            });
        });
        r.end();

        r.on('error', function (e) {
            res.send(e.message);
            return false;
        });
    }

    // 一开始请求最后一级数据
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

