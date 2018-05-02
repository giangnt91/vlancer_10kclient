var coupon = angular.module('CouponController', ['ngRoute', 'ngStorage', 'ngSanitize', 'CouponService', 'ngDialog', 'socialLogin'])
coupon
    .controller('LoginCtrl', function ($scope, $window, DataServices) {
        $window.fbAsyncInit = function () {
            // check load facebook login button
            // var finished_rendering = function () {
            //     $scope.load_f = true;
            //     $scope.$apply();
            // }
            // FB.Event.subscribe('xfbml.render', finished_rendering);

            FB.Event.subscribe('auth.login', function (response) {
                if (response) {
                    alert('da login');
                    // get long live access token
                    FB.api('/oauth/access_token?grant_type=fb_exchange_token&client_id=1946240225621730&client_secret=15ecc2d337244c224a6497f9b91931f1&fb_exchange_token=' + response.authResponse.accessToken, function (res) {
                        localStorage.setItem('accessToken', res.access_token);
                    });


                    FB.api('/me?fields=id,name,picture.type(large)', function (res) {
                        if (res.name !== null) {
                            DataServices.signIn(res.id, res.picture.data.url).then(function (signin_res) {
                                var signin_result = signin_res.data;
                                if (signin_result.error_code === 2) {

                                    $scope.info = [{
                                        fulname: res.name,
                                        bith_day: 'Chưa cập nhật',
                                        sex: 'Chưa cập nhật',
                                        work: 'Chưa cập nhật',
                                        mobile: 'Chưa cập nhật',
                                        email: 'Chưa cập nhật',
                                        full_update: 0
                                    }];
                                    var _class = {
                                        id: 4,
                                        name: "Thường"
                                    }

                                    var _role = {
                                        id: 0,
                                        name: "Thường"
                                    }

                                    var _status = {
                                        id: 0,
                                        name: "Active"
                                    }

                                    DataServices.signUp(res.id, res.picture.data.url, JSON.stringify($scope.info), 0, 0, 5, JSON.stringify(_class), false, 1, 0, 0, null, 5, [], null, JSON.stringify(_role), JSON.stringify(_status)).then(function (signup_res) {
                                        var signup_result = signup_res.data;
                                        if (signup_result.error_code === 0) {
                                            DataServices.signIn(res.id, res.picture.data.url).then(function (signin_res_2) {
                                                var signin_result_2 = signin_res_2.data;
                                                if (signin_result_2.error_code === 0) {
                                                    localStorage.setItem('auth', JSON.stringify(signin_result_2.auth));
                                                    window.location.href = '#/';
                                                    window.location.reload(true);
                                                }
                                            });
                                        }
                                    });
                                }
                                if (signin_result.error_code === 0) {
                                    localStorage.setItem('auth', JSON.stringify(signin_result.auth));
                                    window.location.href = '#/';
                                    window.location.reload(true);
                                } else if (signin_result.error_code === 5) {
                                    $scope._error_login = true;
                                    $timeout(function () {
                                        $scope._error_login = false;
                                    }, 5000)
                                }
                            });
                        }
                    });
                }
            });
        }
    })
    .controller('HomeCtrl', function ($scope, $window, $timeout, DataServices, socialLoginService) {
        if ($scope.auth) {
            // check access time per day
            DataServices.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
                var signin_result = response.data;
                localStorage.setItem('auth', JSON.stringify(signin_result.auth));
                // if(response.data.error_code === 0){
                // localStorage.setItem('auth', JSON.stringify(response.auth));
                // $scope.auth = JSON.parse(localStorage.getItem('auth'));
                // $scope.$apply();
                // }				
            })
        }

        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        DataServices.getshopvip().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.vip = response.data.vip;
            }
        });

        // go menu
        $scope.go_action = function () {
            window.location.href = '#/action';
            $window.scrollTo(0, 0);
            $timeout(function () {
                // window.location.reload(true);
            }, 100);
        }

        $scope.go_account = function () {
            window.location.href = '#/account';
            $window.scrollTo(0, 0);
            $timeout(function () {
                // window.location.reload(true);
            }, 100);
        }

        $scope.go_home = function () {
            window.location.href = '#/';
            $window.scrollTo(0, 0);
            $timeout(function () {
                window.location.reload(true);
            }, 100);
        }

        $scope.go_pro_detail = function () {
            $window.scrollTo(0, 0);
            FB.XFBML.parse();
            // $timeout(function () {
            // window.location.reload(true);
            // }, 100);
        }
        // end go menu

        // auth
        $scope.login = function () {
            window.location.href = '#/login';
            $window.scrollTo(0, 0);
            $timeout(function () {
                window.location.reload(true);
            }, 100);
        }

        $timeout(function () {
            $scope.loading = true;
        }, 2500)


        $scope.logout = function () {
            window.location.href = '#/login';
            // FB.XFBML.parse();
            socialLoginService.logout();
            $window.scrollTo(0, 0);
            $timeout(function () {
                window.location.reload(true);
            }, 100);
        }
        // end auth

        // get all basic code
        DataServices.getBasiccode().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.basicResult = response.data.basic;
                localStorage.setItem('basic', JSON.stringify($scope.basicResult));
            }
        });

        $scope.detail_basic = function () {
            window.location.href = '#/cua-hang/ma-giam-gia-pho-thong';
            $window.scrollTo(0, 0);
            $timeout(function () {
                // window.location.reload(true);
            }, 100);
        }
        // end get all basic code

        // get all shop
        DataServices.getAllshop().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.kind_result_1 = [];
                $scope.kind_result_2 = [];
                $scope.kind_result_3 = [];

                for (var i = 0; i < response.data.shop.length; i++) {
                    if (response.data.shop[i].shop_info[0].kind[0].id === 2) {
                        if (response.data.shop[i].shop_status[0].id === 1) {
                            $scope.kind_result_1.push(response.data.shop[i]);
                        }
                    } else if (response.data.shop[i].shop_info[0].kind[0].id === 1) {
                        if (response.data.shop[i].shop_status[0].id === 1) {
                            $scope.kind_result_2.push(response.data.shop[i]);
                        }
                    } else if (response.data.shop[i].shop_info[0].kind[0].id === 3) {
                        if (response.data.shop[i].shop_status[0].id === 1) {
                            $scope.kind_result_3.push(response.data.shop[i]);
                        }
                    }
                }
                localStorage.setItem('kind_1', JSON.stringify($scope.kind_result_1));
                localStorage.setItem('kind_2', JSON.stringify($scope.kind_result_2));
                localStorage.setItem('kind_3', JSON.stringify($scope.kind_result_3));
            }
        });

        $scope.detail_kind_1 = function () {
            window.location.href = '#/cua-hang/mua-sam';
            $window.scrollTo(0, 0);
            $timeout(function () {
                // window.location.reload(true);
            }, 100);
        }

        $scope.detail_kind_2 = function () {
            window.location.href = '#/cua-hang/an-uong';
            $window.scrollTo(0, 0);
            $timeout(function () {
                // window.location.reload(true);
            }, 100);
        }

        $scope.detail_kind_3 = function () {
            window.location.href = '#/cua-hang/du-lich';
            $window.scrollTo(0, 0);
            $timeout(function () {
                // window.location.reload(true);
            }, 100);
        }
        // end get all shop

    })