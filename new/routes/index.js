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
    if (url.split('/').length ===2) {
        arr = [url.substring(1), ''];
    } else {
        arr = handleUrl(url);
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
                if (j < arr.length) {
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
                    } else {
                        res.send([result,arr]);
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

