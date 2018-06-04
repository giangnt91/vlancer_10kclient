angular.module('coupon10k', ['ngRoute', 'CouponController', 'CouponService'])
    .config(['$routeProvider', '$locationProvider', 'socialProvider' , function ($routeProvider, $locationProvider, socialProvider) {
        $routeProvider

            //Url
            .when('/', { templateUrl: 'partials/home.html', controller: 'HomeCtrl' })
            .when("/dang-nhap", { templateUrl: "partials/login.html", controller: "LoginCtrl" })
            .when("/:danhmuc/:cuahang", { templateUrl: "partials/all_pro.html", controller: "ProductCtrl" })
            // .when("/:danhmuc/:cuahang/:slug-:id", { templateUrl: "partials/pro_detail.html", controller: "ProdetailCtrl" })
            .when("/:danhmuc/:cuahang/:slug-:id", { templateUrl: "partials/prov2.html", controller: "ProdetailCtrl" })
            .when("/thuc-hien-tac-vu", { templateUrl: "partials/action.html", controller: "ActionCtrl" })
            .when("/quan-ly-tai-khoan", { templateUrl: "partials/account.html", controller: "AccountCtrl" })

            //Otherwise
            .otherwise({ redirectTo: '/dang-nhap' });

            $locationProvider
            $locationProvider.html5Mode(true);

        socialProvider.setFbKey({ appId: "1946240225621730", apiVersion: "v2.10" })

    }])