angular.module('coupon10k', ['ngRoute', 'CouponController', 'CouponService'])
    .config(['$routeProvider', '$locationProvider', 'socialProvider', function ($routeProvider, $locationProvider, socialProvider) {
        $routeProvider

            //Url
            .when('/', { templateUrl: 'partials/home.html', controller: 'HomeCtrl' })
            .when("/:danhmuc/:cuahang", { templateUrl: "partials/all_pro.html", controller: "ProductCtrl" })
            .when("/:danhmuc/:cuahang/:slug-:id", { templateUrl: "partials/prov2.html", controller: "ProdetailCtrl" })
            .when("/thuc-hien-tac-vu", { templateUrl: "partials/action.html", controller: "ActionCtrl" })
            .when("/quan-ly-tai-khoan", { templateUrl: "partials/account.html", controller: "AccountCtrl" })
            .when("/huong-dan-su-dung", { templateUrl: "partials/tutorial.html", controller: "HomeCtrl" })
            .when("/lien-he", { templateUrl: "partials/contact.html" })
            .when("/doi-qua", { templateUrl: "partials/gift.html", controller: "GiftsCtrl" })
            .when("/qua?:key", { templateUrl: "partials/detailgift.html", controller: "GiftCtrl" })

            //Otherwise
            .otherwise({ redirectTo: '/' });

        $locationProvider
        $locationProvider.html5Mode(true);

        // socialProvider.setFbKey({ appId: "1781038452116644", apiVersion: "v3.2"})
        socialProvider.setGoogleKey("1026230976029-cja0blpg6q54tq9pr6rru5rq9c6pducu.apps.googleusercontent.com");

    }])