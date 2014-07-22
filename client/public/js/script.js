/*global $*/

var handleSuccess = function (url, callback) {
    return {
        url: url,
        crossDomain: true,
        type: "GET",
        dataType: "jsonp",
        success: callback
    };
};

var tmpl = function (str, options) {
    var s = str;
    if (!options || typeof options !== "object") {
        return;
    }
    for (var i in options) {
        var reg = new RegExp("{{#" + i + "}}", "g");
        s = s.replace(reg, options[i]);
    }

    return s;
};
var baseUrl = "http://10.0.200.185:9987/ls/";
// var baseUrl = "/wl/";


$.ajax(handleSuccess(baseUrl, function (data) {
    $("body").append($("#wl-index-template").html());

    $.each(data, function (index, item) {
        var template = tmpl($("#wl-class").html(),{title: item.name});
        if (index%4 === 0) {
            $(".wl-main").append($("<div class='row wl-row'></div>"));
        }
        $(".wl-row:last").append(template);
        
    });
}));



$("body").on("click", ".wl-class-link", function () {
    var current = $(this).data("class");
    var targetLink = baseUrl + current;

    $.ajax(handleSuccess(targetLink, function (data) {
        $.ajax(handleSuccess(baseUrl, function (d) {
            $("body div").remove();

            var template = tmpl($("#wl-product-template").html(), {current: data.current.name});
            $("body").append(template);

            getClassPage(data, d);
            
        }));
    }));
});


$("body").on("click", ".wl-list .classes", function () {
    if ($(this).hasClass("editable-disabled")) {
        var targetLink = baseUrl + $(this).data("class");

        $.ajax(handleSuccess(targetLink, function (data) {
            $.ajax(handleSuccess(baseUrl, function (d) {
                getClassPage(data, d);
            }));
        }));
    }
});

$("body").on("click", ".wl-product-body .wl-item", function () {
    if ($(this).hasClass("editable-disabled")) {
        var targetLink = baseUrl + $(".sub-header").html() +"/"+ $(this).data("product");
        $.ajax(handleSuccess(targetLink, function (data) {
            data.class = $(".sub-header").html();
            getProductPage(data);
        }));
    }
});

$("body").on("click", ".wl-list .child-product", function () {
    if ($(this).hasClass("editable-disabled")) {
        var targetLink = baseUrl + $(".wl-header-nav a").eq(0).html()+"/" + $(".wl-header-nav a").eq(1).html() +"/"+$(this).data("class");

        $.ajax(handleSuccess(targetLink, function (data) {
            $.ajax(handleSuccess(targetLink.substring(0, targetLink.lastIndexOf('/')), function (d) {
                getChildPage(data, d);
            }));
        }));
    }
});

$("body").on("click", ".wl-header-nav a", function () {
    var shortLink = $(this).data("link");
    var targetLink = baseUrl + shortLink;
    $.ajax(handleSuccess(targetLink, function (data) {
        var l = shortLink.split("/").length;
        if (l === 2) {
            $.ajax(handleSuccess(baseUrl, function (d) {
                getClassPage(data, d);
            }));
        } else if (l === 3 ) {
            data.class = $(".wl-header-nav a:first").html();
            getProductPage(data);
        } else if (l === 4) {
            $.ajax(handleSuccess(baseUrl+shortLink.substring(0,shortLink.lastIndexOf("/")), function (d) {
                getChildPage(data,d);
            }));
        }
    }));
});

$("body").on("click", ".wl-pager a", function () {
    $(".wl-pager li").removeClass("active");
    var links = [], $this = $(this);
    $(".wl-header-nav a").each(function (index, item) {
        links.push($(item).html());
    });

    var targetLink = baseUrl + links.join("/") + "?offset=" + ($(this).data("page")-1)*100 + "&limit=100";
    $.ajax(handleSuccess(targetLink, function (data) {
        if (links.length > 1) {
            updateRightMiddle(data.ip, true);
        } else {
            updateRightMiddle(data.product);
        }
        $this.parent().addClass("active");

    }));
});




var getClassPage = function (data, d) {
    updateLeft(d, data.current.name, "classes");
    updateRightTop([data.current.name], data.current.name);
    updateRightMiddle(data.product);
    d.forEach(function (item,index) {
        if (item.name === data.current.name) {
            updateRightBottom(Math.ceil(item.amount/100));
        }
    });
};

var getProductPage = function (data) {
    updateLeft(data.product, data.current.name, "child-product");
    updateRightTop([data.class, data.current.name], data.current.name);
    updateRightMiddle(data.ip, true);
    $(".wl-pager li").not(":first").not(":last").remove();
};

var getChildPage = function (data, d) {
    updateLeft(d.product, data.current.name, "child-product");
    updateRightTop([$(".wl-header-nav a").eq(0).html(), $(".wl-header-nav a").eq(1).html(), data.current.name], data.current.name);
    updateRightMiddle(data.ip, true);
    $(".wl-pager li").not(":first").not(":last").remove();
};

var updateLeft = function (data, current, className) {
    $(".wl-list li").not(":first").remove();
    $.each(data, function (index, item) {
        var template = tmpl($("#wl-left-template").html(), {name: item.name, number: item.amount, weight: item.weight, className: className, id: item.id});
        $(".wl-list").append(template);
    });

    $(".wl-list li").each(function (index, item) {
        if ($(item).find("a").data("class") === current) {
            $(item).addClass("active");
        }
    });

    $(".classes").parent().find(".wl-weight").remove();

    updateLeftEvent();
};

var updateRightTop = function (data, current) {
    $(".wl-header-nav li").remove();
    var str = "";
    $.each(data, function (index, item) {
        str = str + item + "/";
        var template = tmpl($("#wl-righttop-template").html(), {link: item, target: str});
        $(".wl-header-nav").append(template);
    });
    $(".sub-header").html(current);
};

var updateRightMiddle = function (data, ip) {
    $(".wl-product-body tr").remove();
    if (ip) {
        $.each(data, function (index, item) {
            var template = tmpl($("#wl-rightip-template").html(), {id: item.id, ip: item.value});
            if (index%4 === 0) {
                $(".wl-product-body").append($("<tr></tr>"));
            }

            $(".wl-product-body tr:last").append(template);
        });
    } else {
        $.each(data, function (index, item) {
            var template = tmpl($("#wl-rightmiddle-template").html(), {name: item.name, weight: item.weight, number: item.count, id: item.id});
            if (index%4 === 0) {
                $(".wl-product-body").append($("<tr></tr>"));
            }

            $(".wl-product-body tr:last").append(template);
        });
    }

    updateRightEvent();
};

var updateRightBottom = function (length) {
    $(".wl-pager li").not(":first").not(":last").remove();

    for (var i = 1; i <= length; i++) {
        var template = tmpl($("#wl-rightbottom-template").html(), {i:i});
        $(".wl-pager li:last").before(template);
    }
};




var updateLeftEvent = function () {
    $("body").off("click", ".wl-btn");
    $("body").on("click", ".wl-btn", function () {
        $(".wl-list a:not(.wl-btn)").editable("toggleDisabled");
        $(this).html($(this).html()==="编辑" ? "取消" : "编辑");
    });
    updateLeftEdiable();
};

var updateRightEvent = function () {
    $("body").off("click", ".wl-edit-btn");
    $("body").on("click", ".wl-edit-btn", function(){
        $(".table a").editable("toggleDisabled");
        $(this).html($(this).html()==="编辑"? "取消" : "编辑");
    });
    updateRightEditable();
};

var updateRightEditable = function () {

    $(".table a").each(function (index, item) {
        $(item).editable({
            title: "Input the value",
            type: "text",
            pk: $(this).data("id"),
            url: "/wl/ip"
        });
    });

    $(".table a").editable("toggleDisabled");
};

var updateLeftEdiable = function () {
    $(".wl-list a").each(function (index, item) {
        $(item).editable({
            title: "Input the value",
            type: "text",
            pk: $(this).data("id"),
            url: "/wl/update"
        });
    });

    $(".wl-list a").editable("toggleDisabled");

};