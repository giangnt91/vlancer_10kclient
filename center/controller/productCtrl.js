coupon
    .controller('ProductCtrl', function ($scope, $routeParams, $timeout, ngDialog, $window) {
        $scope.kind_1 = JSON.parse(localStorage.getItem('kind_1'));
        $scope.kind_2 = JSON.parse(localStorage.getItem('kind_2'));
        $scope.kind_3 = JSON.parse(localStorage.getItem('kind_3'));
        $scope.basic = JSON.parse(localStorage.getItem('basic'));

        if ($routeParams.name === "mua-sam") {
            $scope.show_kind_1 = true;
        } else if ($routeParams.name === "an-uong") {
            $scope.show_kind_2 = true;
        } else if ($routeParams.name === "du-lich") {
            $scope.show_kind_3 = true;
        }
        if ($routeParams.name === "ma-giam-gia-pho-thong") {
            $scope.show_basic = true;
        }

        $scope.go_pro_detail = function () {
            $window.scrollTo(0, 0);
            FB.XFBML.parse();
            // $timeout(function () {
            // window.location.reload(true);
            // }, 100);
        }

        $scope.viewall = false;
        $scope.hide_view_all = function () {
            // $scope.dialog = ngDialog.open({
            //     template:
            //         '<h4 class="flow-text center">Đang tải dữ liệu</h4>  <div class="progress"> <div class="indeterminate"></div> </div>',
            //     plain: true,
            //     showClose: false,
            //     closeByDocument: false
            // });
            // $timeout(function () {
            //     $scope.dialog.close();
            //     $scope.viewall = true;
            // }, 3000);
            $scope.viewall = true;
        }

    })

    .controller('ProdetailCtrl', function ($scope, $routeParams, $timeout, ngDialog, DataServices) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.kind_1 = JSON.parse(localStorage.getItem('kind_1'));
        $scope.kind_2 = JSON.parse(localStorage.getItem('kind_2'));
        $scope.kind_3 = JSON.parse(localStorage.getItem('kind_3'));
        var accessToken = localStorage.getItem('accessToken');

        var shopId = $routeParams.shopid;
        var name = $routeParams.name;
        $scope.show_like = false;

        if (shopId) {

            DataServices.getByshopid(shopId).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.shop = response.data.shop;
                    var tmp_shop;
                    var tmp_server;
                    if ($scope.shop.shop_coupon.length > 0) {
                        tmp_shop = $scope.shop.shop_coupon[0].coupon.length;
                    } else {
                        tmp_shop = 0;
                    }

                    if ($scope.shop.server_coupon.length > 0) {
                        tmp_server = $scope.shop.server_coupon[0].coupon.length;
                    } else {
                        tmp_server = 0;
                    }
                    $scope.total_coupon = tmp_server + tmp_shop;

                    check_user_have_coupon();

                }
            });


            // check condition
            function check_user_have_coupon() {

                if ($scope.auth !== null) {
                    // get new auth
                    DataServices.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
                        if (response.data.error_code === 0) {
                            localStorage.setItem('auth', JSON.stringify(response.data.auth));
                        }
                    });

                    // check point
                    if ($scope.auth[0].point_plus < 1000) {
                        $scope.condition = true;
                        $scope.enable_point = true;
                        // $scope.show_like = false;
                    } else {
                        $scope.condition = false;
                        $scope.enable_point = false;
                        $scope.show_like = true;
                    }


                    // check feedback
                    if ($scope.auth[0].use_coupon.length > 0) {
                        $scope.feedback_count = 0;
                        for (var i = 0; i < $scope.auth[0].use_coupon.length; i++) {
                            if ($scope.auth[0].use_coupon[i].feedback === null) {
                                $scope.condition = true;
                                // $scope.show_like = false;
                                $scope.feedback_count = + 1;
                            } else {
                                $scope.condition = false;
                                $scope.show_like = true;
                            }
                        }
                    }

                    // check user get coupon
                    if ($scope.auth[0].total_list_coupon.length > 0) {
                        for (var i = 0; i < $scope.auth[0].total_list_coupon.length; i++) {

                            //check shop coupon
                            if ($scope.shop.shop_coupon.length > 0) {
                                if ($scope.auth[0].total_list_coupon[i].release_day === $scope.shop.shop_coupon[0].coupon[0].release_day) {
                                    $scope._get = true;
                                    $scope.condition = true;
                                } else {
                                    $scope._get = false;
                                    $scope.condition = false;
                                    if ($scope.shop.user_like_shop.length > 0) {
                                        $scope.shop.user_like_shop.forEach(element => {
                                            if (element.id === $scope.auth[0].user_id) {
                                                $scope.show_like = false;
                                            } else {
                                                $scope.show_like = true;
                                            }
                                        });
                                    }
                                }
                            } else if ($scope.shop.shop_coupon.length === 0) {
                                for (var j = 0; j < $scope.shop.user_get_coupon.length; j++) {
                                    if ($scope.auth[0].total_list_coupon[i].release_day === $scope.shop.user_get_coupon[j].release_day) {
                                        $scope._get = true;
                                        $scope.condition = true;
                                    } else {
                                        $scope._get = false;
                                        $scope.condition = false;
                                        if ($scope.shop.user_like_shop.length > 0) {
                                            $scope.shop.user_like_shop.forEach(element => {
                                                if (element.id === $scope.auth[0].user_id) {
                                                    $scope.show_like = false;
                                                } else {
                                                    $scope.show_like = true;
                                                }
                                            });
                                        }
                                    }
                                }
                            }

                            // check server coupon 
                            else if ($scope.shop.server_coupon.length > 0) {
                                if ($scope.auth[0].total_list_coupon[i].release_day === $scope.shop.server_coupon[0].coupon[0].release_day) {
                                    $scope._get = true;
                                    $scope.condition = true;
                                } else {
                                    $scope._get = false;
                                    $scope.condition = false;
                                    if ($scope.shop.user_like_shop.length > 0) {
                                        $scope.shop.user_like_shop.forEach(element => {
                                            if (element.id === $scope.auth[0].user_id) {
                                                $scope.show_like = false;
                                            } else {
                                                $scope.show_like = true;
                                            }
                                        });
                                    }
                                }
                            } else if ($scope.shop.server_coupon.length === 0) {
                                for (var s = 0; s < $scope.shop.user_get_coupon.length; s++) {
                                    if ($scope.auth[0].total_list_coupon[i].release_day === $scope.shop.user_get_coupon[s].release_day) {
                                        $scope._get = true;
                                        $scope.condition = true;
                                    } else {
                                        $scope._get = false;
                                        $scope.condition = false;
                                        if ($scope.shop.user_like_shop.length > 0) {
                                            $scope.shop.user_like_shop.forEach(element => {
                                                if (element.id === $scope.auth[0].user_id) {
                                                    $scope.show_like = false;
                                                } else {
                                                    $scope.show_like = true;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }



                    if ($scope.auth[0].use_coupon.length > 0) {

                        for (var i = 0; i < $scope.auth[0].use_coupon.length; i++) {
                            if ($scope.shop.shop_coupon.length > 0) {
                                if ($scope.auth[0].use_coupon[i].release_day === $scope.shop.shop_coupon[0].coupon[0].release_day) {
                                    $scope.condition = true;
                                    $scope._get = true;
                                } else {
                                    $scope._get = false;
                                    $scope.condition = false;
                                    if ($scope.shop.user_like_shop.length > 0) {
                                        $scope.shop.user_like_shop.forEach(element => {
                                            if (element.id === $scope.auth[0].user_id) {
                                                $scope.show_like = false;
                                            } else {
                                                $scope.show_like = true;
                                            }
                                        });
                                    }
                                }
                            } else if ($scope.shop.server_coupon.length > 0) {
                                if ($scope.auth[0].use_coupon[i].release_day === $scope.shop.server_coupon[0].coupon[0].release_day) {
                                    $scope.condition = true;
                                    $scope._get = true;
                                } else {
                                    $scope._get = false;
                                    $scope.condition = false;
                                    if ($scope.shop.user_like_shop.length > 0) {
                                        $scope.shop.user_like_shop.forEach(element => {
                                            if (element.id === $scope.auth[0].user_id) {
                                                $scope.show_like = false;
                                            } else {
                                                $scope.show_like = true;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }

                    // check show like
                    if ($scope.shop.user_like_shop !== null && $scope.shop.user_like_shop.length > 0) {
                        for (var i = 0; i < $scope.shop.user_like_shop.length; i++) {
                            if ($scope.auth[0].user_id === $scope.shop.user_like_shop[i].id) {
                                $scope.show_like = false;
                            } else {
                                $scope.show_like = true;
                            }
                        }
                    } else {
                        $scope.show_like = true;
                    }

                    // check rank
                    if ($scope.shop.shop_coupon !== null && $scope.shop.shop_coupon.length > 0) {
                        if ($scope.auth[0].user_class[0].id > $scope.shop.shop_coupon[0].coupon[0].class_user[0].id) {
                            $scope._rank = true;
                            $scope.condition = true;
                        } else {
                            $scope.condition = false;
                            $scope._rank = false;
                            // $scope.show_like = true;
                        }
                    } else {
                        if ($scope.shop.server_coupon !== null && $scope.shop.server_coupon.length > 0) {
                            if ($scope.auth[0].user_class[0].id > $scope.shop.server_coupon[0].coupon[0].class_user[0].id) {
                                $scope._rank = true;
                                $scope.condition = true;
                            } else {
                                $scope.condition = false;
                                $scope._rank = false;
                                // $scope.show_like = true;
                            }
                        }
                    }


                } else {
                    $scope.show_like = true;
                }




                // get coupon info
                if ($scope.shop.shop_coupon !== null && $scope.shop.shop_coupon.length > 0) {
                    $scope.coupon_info = $scope.shop.shop_coupon[0].coupon[0].coupon_info;
                    $scope.coupon_expire = $scope.shop.shop_coupon[0].coupon[0].time_expire;
                    $scope.rank_user = $scope.shop.shop_coupon[0].coupon[0].class_user[0];
                } else {
                    if ($scope.shop.server_coupon !== null && $scope.shop.server_coupon.length > 0) {
                        $scope.coupon_info = $scope.shop.server_coupon[0].coupon[0].coupon_info;
                        $scope.coupon_expire = $scope.shop.server_coupon[0].coupon[0].time_expire;
                        $scope.rank_user = $scope.shop.server_coupon[0].coupon[0].class_user[0];
                    } else {
                        $scope.coupon_info = "Đang cập nhật";
                        $scope.rank_user = "Đang cập nhật";
                        $scope.coupon_expire = "Đang cập nhật";
                    }
                }
                // end get coupon info

            }
            // end check condition


            // like fan page
            $scope.open_like = function () {
                var finished_rendering = function () {
                    $timeout(function () {
                        $scope.load_fa = true;
                        $scope.$apply();
                    }, 300);

                }
                FB.Event.subscribe('xfbml.render', finished_rendering);
                FB.XFBML.parse();
                FB.api('/' + $scope.shop.shopId + '?access_token=' + accessToken, { fields: 'fan_count' }, (response) => {
                    $scope.pre_fan_count = response.fan_count;
                });
            }

            $scope.close_like = function () {
                $scope.dialog = ngDialog.open({
                    template:
                        '<h4 class="flow-text center">Đang xử lý dữ liệu</h4>  <div class="progress"> <div class="indeterminate"></div> </div>',
                    plain: true,
                    showClose: false,
                    closeByDocument: false
                });

                $timeout(function () {
                    FB.api('/' + $scope.shop.shopId + '?access_token=' + accessToken, { fields: 'fan_count' }, (response) => {
                        if ($scope.pre_fan_count < response.fan_count) {
                            $scope.show_like = false;
                            $scope.$apply();

                            DataServices.updateshopLike($scope.shop._id, $scope.auth[0].user_id, $scope.auth[0].info[0].fulname).then(function (response) {
                                if (response.error_code === 0) {
                                    $scope.show_like = false;
                                }
                            });

                        } else {
                            //update point bad for user
                            DataServices.Bad($scope.auth[0]._id).then(function (response) { });
                            $scope.dialog = ngDialog.open({
                                template: '<h4 class="flow-text red-text center">Có lỗi trong quá trình sử lý <br> vui lòng thử lại</h4>',
                                plain: true,
                                showClose: true
                            });
                        }
                    });
                    $scope.dialog.close();
                }, 5000);
            }
            // end like fan page


            // get coupon 
            $scope.get_coupon = function () {
                var the_issuer;
                var first_coupon;
                var new_list = [];
                var day = new Date();
                var day_get = day.getDate() + '/' + (day.getMonth() + 1) + '/' + day.getFullYear();

                // create new coupon for user and update list and check issuer
                if ($scope.shop.shop_coupon !== null && $scope.shop.shop_coupon.length > 0) {
                    first_coupon = {
                        approved: $scope.shop.shop_coupon[0].coupon[0].approved,
                        feedback: $scope.shop.shop_coupon[0].coupon[0].feedback,
                        rating: $scope.shop.shop_coupon[0].coupon[0].rating,
                        time_user_use: $scope.shop.shop_coupon[0].coupon[0].time_user_use,
                        time_user_get: day_get,
                        userid_get_coupon: $scope.auth[0].user_id,
                        status_coupon: $scope.shop.shop_coupon[0].coupon[0].status_coupon,
                        the_issuer: $scope.shop.shop_coupon[0].coupon[0].the_issuer,
                        time_expire: $scope.shop.shop_coupon[0].coupon[0].time_expire,
                        release_day: $scope.shop.shop_coupon[0].coupon[0].release_day,
                        class_user: $scope.shop.shop_coupon[0].coupon[0].class_user,
                        value: $scope.shop.shop_coupon[0].coupon[0].value,
                        coupon_info: $scope.shop.shop_coupon[0].coupon[0].coupon_info,
                        shop_id: $scope.shop.shop_coupon[0].coupon[0].shop_id
                    };
                    new_list = $scope.shop.shop_coupon[0].coupon.slice(1);
                    the_issuer = first_coupon.shop_id;
                } else {
                    if ($scope.shop.server_coupon !== null && $scope.shop.server_coupon.length > 0) {
                        first_coupon = {
                            approved: $scope.shop.server_coupon[0].coupon[0].approved,
                            feedback: $scope.shop.server_coupon[0].coupon[0].feedback,
                            rating: $scope.shop.server_coupon[0].coupon[0].rating,
                            time_user_use: $scope.shop.server_coupon[0].coupon[0].time_user_use,
                            time_user_get: day_get,
                            userid_get_coupon: $scope.auth[0].user_id,
                            status_coupon: $scope.shop.server_coupon[0].coupon[0].status_coupon,
                            the_issuer: $scope.shop.server_coupon[0].coupon[0].the_issuer,
                            time_expire: $scope.shop.server_coupon[0].coupon[0].time_expire,
                            release_day: $scope.shop.server_coupon[0].coupon[0].release_day,
                            class_user: $scope.shop.server_coupon[0].coupon[0].class_user,
                            value: $scope.shop.server_coupon[0].coupon[0].value,
                            coupon_info: $scope.shop.server_coupon[0].coupon[0].coupon_info,
                            shop_id: $scope.shop.server_coupon[0].coupon[0].shop_id
                        };
                        new_list = $scope.shop.server_coupon[0].coupon.slice(1);
                        the_issuer = 1;
                    }
                }

                // update total slot of user
                var new_slot = $scope.auth[0].empty_slot - 1;

                DataServices.updateCoupon($scope.shop._id, the_issuer, JSON.stringify(new_list), JSON.stringify(first_coupon), $scope.auth[0]._id, new_slot).then(function (response) {
                    if (response.data.error_code === 0) {
                        check_user_have_coupon();
                        $scope.dialog = ngDialog.openConfirm({
                            template:
                                '<h4 class="flow-text green-text center">Nhận Coupon thành công</h4> <br>' +
                                '<center><button type="button" class="waves-effect waves-light btn" style="" ng-click="confirm(confirmValue)">Ok</button></center>',
                            plain: true,
                            showClose: false,
                            closeByDocument: false
                        }).then(function (comfirm) {
                            $timeout(function () {
                                window.location.reload(true);
                            }, 100);
                        });
                    }
                });
            }
            // end get coupon
        }

    })