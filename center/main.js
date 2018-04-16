angular.module('coupon10k', ['ngRoute', 'CouponController', 'CouponService'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider

            //Url
            .when('/', { templateUrl: 'partials/home.html', controller: 'HomeCtrl' })
            .when("/login", { templateUrl: "partials/login.html", controller: "LoginCtrl" })
            .when("/cua-hang/:name", { templateUrl: "partials/all_pro.html", controller: "ProductCtrl" })
            .when("/:name/:shopid", { templateUrl: "partials/pro_detail.html", controller: "ProdetailCtrl" })
            .when("/action", { templateUrl: "partials/action.html", controller: "ActionCtrl" })
            .when("/account", { templateUrl: "partials/account.html", controller: "AccountCtrl" })

            //Otherwise
            .otherwise({ redirectTo: '/login' });

        // $locationProvider
        //     .html5Mode({
        //         enabled: true,
        //         requireBase: false
        //     });

    }])