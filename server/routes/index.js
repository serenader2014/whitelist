var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.json([
    {
        "name": "http",
        "id": "0",
        "amount": "2004",
        "weight" : "20"
    },
    {
        "name": "cdn",
        "id": "1",
        "amount": "2004",
        "weight" : "20"
    },
    {
        "name": "online game",
        "id": "2",
        "amount": "2004",
        "weight" : "20"
    }
    ]);
});
router.get('/ip', function (req, res, next) {
    var ip = req.query.ip;
    res.json({
        ip: ip,
        isp: '电信',
        parent: 'qq.com'
    });
}); 

router.get('/:name', function (req, res, next) {
    var name = req.params.name;
    var query = req.query.page;
    if (req.query.sort) {
        res.json({
            "product": [
            {
                "name": "a.com",
                "weight": "100",
                "count": "10"
            }
            ]
        });
    }
    if (req.query.search) {
        res.json({
            ip: [
            '123.44.13.55',
            '23.12.45.158',
            '110.120.140.140',
            '80.20.120.122',
            '69.10.34.10'
            ],
            product: [
            'qq.com',
            'qvod.com'
            ]
        });
    }
    var json = {
        "current": {
            "name": name,
            "id": "0",
            "amount": "2004",
        },

        "product": [
            {
                "name": "qq.com",
                "weight": "20",
                "amount": "200",
                "id": "0"
            }
        ],
        "count": "5239"
    };
    res.json(json);
});




router.get('/:class/:product', function (req, res, next) {
    var className = req.params.class,
        productName = req.params.product;
    var json = {
        "current": {
            "name": productName,
            "id": 0,
            "amount": "200",
            "weight": "10"
        },
        ip: [
        {value: "192.124.56.23",id:"1"},
        {value: "120.134.11.22",id:"2"},
        {value: "198.142.56.22",id:"3"}
        ],

        product: [
            {
                "name": "mail.qq.com",
                "id": "0",
                "amount": "200",
                "weight" : "20"
            },
            {
                "name": "game.qq.com",
                "id": "1",
                "amount": "200",
                "weight" : "20"
            },
            {
                "name": "weixin.qq.com",
                "id": "2",
                "amount": "200",
                "weight" : "20"
            }    
        ],

        class: className,
        count: 1345
    };

    res.json(json);
});

router.get('/:class/:product/:child', function (req, res, next) {
    var className = req.params.class,
        product = req.params.product,
        child = req.params.child;

    var json = {
        "current": {
            "name": child,
            "id": 0,
            "amount": "200000",
            "weight": "10"
        },
        ip: [
        {value: "192.184.56.23",id:"1"},
        {value: "120.114.71.22",id:"2"},
        {value: "198.142.26.22",id:"3"}
        ],           

        class: className,
        parent: product,
        count: 2000
    };

    res.json(json);

});


router






module.exports = router;
