var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.json([
    {
        "name": "http",
        "id": "0",
        "amount": "200456",
        "weight" : "20"
    },
    {
        "name": "cdn",
        "id": "1",
        "amount": "200456",
        "weight" : "20"
    },
    {
        "name": "game",
        "id": "2",
        "amount": "200456",
        "weight" : "20"
    }
    ]);
});

router.get('/:name', function (req, res, next) {
    var name = req.params.name;
    var query = req.query.page;
    var json = {
        "current": {
            "name": name,
            "id": "0",
            "amount": "200456",
        },

        "product": [
            {
                "name": "qq.com",
                "weight": "20",
                "amount": "20000",
                "id": "0"
            }
        ],
        "count": "10000"
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
            "amount": "200000",
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
                "amount": "200456",
                "weight" : "20"
            },
            {
                "name": "game.qq.com",
                "id": "1",
                "amount": "200456",
                "weight" : "20"
            },
            {
                "name": "weixin.qq.com",
                "id": "2",
                "amount": "200456",
                "weight" : "20"
            }    
        ],

        class: className,
        count: 200000
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
        count: 20000
    };

    res.json(json);

});







module.exports = router;
