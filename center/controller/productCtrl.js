coupon
    .controller('ProductCtrl', function ($scope, $location, $routeParams, $timeout, ngDialog, $window) {
        $scope.kind_1 = JSON.parse(localStorage.getItem('kind_1'));
        $scope.kind_2 = JSON.parse(localStorage.getItem('kind_2'));
        $scope.kind_3 = JSON.parse(localStorage.getItem('kind_3'));
        $scope.basic = JSON.parse(localStorage.getItem('basic'));
        $scope.all_shop = JSON.parse(localStorage.getItem('all_shop'));

        function bo_dau_tv(key) {
            var str = key;
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            str = str.replace(/ + /g, " ");
            str = str.trim();
            return str;
        }

        // find name in string
        if ($routeParams.danhmuc === 'mua-sam') {
            $scope.show_kind_1 = true;
        } else if ($routeParams.danhmuc === 'an-uong') {
            $scope.show_kind_2 = true;
        } else if ($routeParams.danhmuc === 'du-lich') {
            $scope.show_kind_3 = true;
        }
        if ($routeParams.danhmuc === 'ma-giam-gia-pho-thong') {
            $scope.show_basic = true;
        }

        $scope.go_shop_by_id = function (id) {
            $scope.all_shop.forEach(element => {
                if (element._id === id) {
                    var slug = bo_dau_tv(element.shop_info[0].shop_name).split(' ').join('-');
                    var _id = element._id.slice(-5);

                    if (element.shop_info[0].kind[0].id === 1) {
                        $location.path('/an-uong/cua-hang/' + slug + '-' + _id);
                        $window.scrollTo(0, 0);
                        FB.XFBML.parse();
                    } else if (element.shop_info[0].kind[0].id === 2) {
                        $location.path('/mua-sam/cua-hang/' + slug + '-' + _id);
                        $window.scrollTo(0, 0);
                        FB.XFBML.parse();
                    } else {
                        $location.path('/du-lich/cua-hang/' + slug + '-' + _id);
                        $window.scrollTo(0, 0);
                        FB.XFBML.parse();
                    }
                }
            });
        }

        $scope.get_basic_detail = function (id) {
            $scope.basic.forEach(element => {
                if (element._id === id) {
                    $scope.detail_basic = element;
                }
            });
        }

        $scope.go_ma_giam_gia = function (url) {
            window.open(url, '_blank');
        }

        // $scope.go_pro_detail = function () {
        //     $window.scrollTo(0, 0);
        //     FB.XFBML.parse();
        // }

        $scope.viewall = false;
        $scope.hide_view_all = function () {
            $scope.viewall = true;
        }

    })

    .controller('ProdetailCtrl', function ($scope, $filter, $routeParams, $timeout, ngDialog, DataServices) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.all_shop = JSON.parse(localStorage.getItem('all_shop'));
        var accessToken = localStorage.getItem('accessToken');

        $scope.danh_muc = $routeParams.danhmuc;
        var _id = $routeParams.id;
        var shopId;
        $scope.all_shop.forEach(element => {
            if (element._id.indexOf(_id) > 0) {
                shopId = element._id;
            }
        });
        // var name = $routeParams.name;
        $scope.show_like = false;

        if (shopId) {

            DataServices.getByshopid(shopId).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.shop = response.data.shop;
                    var tmp_shop;
                    var tmp_server;
                    $scope.all_feed = [];

                    //get all feedback
                    if ($scope.shop.shop_use_coupon.length > 0) {
                        $scope.shop.shop_use_coupon.forEach(element => {
                            if (element.feedback !== "") {
                                $scope.all_feed.push(element);
                            }
                        });
                    }

                    if ($scope.shop.shop_coupon.length > 0) {
                        tmp_shop = $scope.shop.shop_coupon[0].coupon.length;
                        $scope.o_coupon = $scope.shop.shop_coupon[0].coupon[0];
                    } else {
                        tmp_shop = 0;
                    }

                    if ($scope.shop.server_coupon.length > 0) {
                        $scope.o_coupon = "";
                        tmp_server = $scope.shop.server_coupon[0].coupon.length;
                        $scope.o_coupon = $scope.shop.server_coupon[0].coupon[0];
                    } else {
                        tmp_server = 0;
                    }
                    $scope.total_coupon = tmp_server + tmp_shop;

                    if ($scope.total_coupon === 0) {
                        $scope.condition = true;
                        $scope.show_like = true;
                    }

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

                    // check feedback
                    if ($scope.auth[0].use_coupon.length > 0) {
                        $scope.feedback_count = 0;
                        for (var i = 0; i < $scope.auth[0].use_coupon.length; i++) {
                            if ($scope.auth[0].use_coupon[i].feedback === null) {
                                $scope.condition = true;
                                $scope.feedback_count = + 1;
                            } else {
                                if ($scope.condition !== true) {
                                    $scope.condition = false;
                                }
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
                                    if ($scope.condition !== true) {
                                        $scope.condition = false;
                                    }
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
                                        if ($scope.condition !== true) {
                                            $scope.condition = false;
                                        }
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
                                    if ($scope.condition !== true) {
                                        $scope.condition = false;
                                    }
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
                                        if ($scope.condition !== true) {
                                            $scope.condition = false;
                                        }
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
                                    if ($scope.condition !== true) {
                                        $scope.condition = false;
                                    }
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
                                    if ($scope.condition !== true) {
                                        $scope.condition = false;
                                    }
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
                            // $scope.condition = false;
                            if ($scope.condition !== true) {
                                $scope.condition = false;
                            }
                            $scope._rank = false;
                            // $scope.show_like = true;
                        }
                    } else {
                        if ($scope.shop.server_coupon !== null && $scope.shop.server_coupon.length > 0) {
                            if ($scope.auth[0].user_class[0].id > $scope.shop.server_coupon[0].coupon[0].class_user[0].id) {
                                $scope._rank = true;
                                $scope.condition = true;
                            } else {
                                // $scope.condition = false;
                                if ($scope.condition !== true) {
                                    $scope.condition = false;
                                }
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
                        console.log(response)
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
                $scope._today = $filter('date')(new Date(), 'dd/MM/yyyy');
                // var day_get = day.getDate() + '/' + (day.getMonth() + 1) + '/' + day.getFullYear();
                var the_auth = [{
                    id: $scope.auth[0].user_id,
                    name: $scope.auth[0].info[0].fulname,
                    img: $scope.auth[0].user_img
                }]

                // create new coupon for user and update list and check issuer
                if ($scope.shop.shop_coupon !== null && $scope.shop.shop_coupon.length > 0) {
                    first_coupon = {
                        _id: $scope.shop.shop_coupon[0].coupon[0]._id,
                        approved: $scope.shop.shop_coupon[0].coupon[0].approved,
                        rfeedback: $scope.shop.shop_coupon[0].coupon[0].rfeedback,
                        feedback: $scope.shop.shop_coupon[0].coupon[0].feedback,
                        rating: $scope.shop.shop_coupon[0].coupon[0].rating,
                        time_user_use: $scope.shop.shop_coupon[0].coupon[0].time_user_use,
                        time_user_get: $scope._today,
                        limit_time: $scope.shop.shop_coupon[0].coupon[0].limit_time,
                        userid_get_coupon: the_auth,
                        status_coupon: $scope.shop.shop_coupon[0].coupon[0].status_coupon,
                        the_issuer: $scope.shop.shop_coupon[0].coupon[0].the_issuer,
                        time_expire: $scope.shop.shop_coupon[0].coupon[0].time_expire,
                        release_day: $scope.shop.shop_coupon[0].coupon[0].release_day,
                        class_user: $scope.shop.shop_coupon[0].coupon[0].class_user,
                        value: $scope.shop.shop_coupon[0].coupon[0].value,
                        coupon_info: $scope.shop.shop_coupon[0].coupon[0].coupon_info,
                        shop_id: $scope.shop.shop_coupon[0].coupon[0].shop_id,
                        shop_avatar: $scope.shop.shop_coupon[0].coupon[0].shop_avatar,
                        shop_cover: $scope.shop.shop_coupon[0].coupon[0].shop_cover,
                        shop_name: $scope.shop.shop_coupon[0].coupon[0].shop_name
                    };
                    new_list = $scope.shop.shop_coupon[0].coupon.slice(1);
                    the_issuer = first_coupon.shop_id;
                } else {
                    if ($scope.shop.server_coupon !== null && $scope.shop.server_coupon.length > 0) {
                        first_coupon = {
                            _id: $scope.shop.server_coupon[0].coupon[0]._id,
                            approved: $scope.shop.server_coupon[0].coupon[0].approved,
                            rfeedback: $scope.shop.server_coupon[0].coupon[0].rfeedback,
                            feedback: $scope.shop.server_coupon[0].coupon[0].feedback,
                            rating: $scope.shop.server_coupon[0].coupon[0].rating,
                            time_user_use: $scope.shop.server_coupon[0].coupon[0].time_user_use,
                            time_user_get: $scope._today,
                            limit_time: $scope.shop.server_coupon[0].coupon[0].limit_time,
                            userid_get_coupon: the_auth,
                            status_coupon: $scope.shop.server_coupon[0].coupon[0].status_coupon,
                            the_issuer: $scope.shop.server_coupon[0].coupon[0].the_issuer,
                            time_expire: $scope.shop.server_coupon[0].coupon[0].time_expire,
                            release_day: $scope.shop.server_coupon[0].coupon[0].release_day,
                            class_user: $scope.shop.server_coupon[0].coupon[0].class_user,
                            value: $scope.shop.server_coupon[0].coupon[0].value,
                            coupon_info: $scope.shop.server_coupon[0].coupon[0].coupon_info,
                            shop_id: $scope.shop.server_coupon[0].coupon[0].shop_id,
                            shop_avatar: $scope.shop.server_coupon[0].coupon[0].shop_avatar,
                            shop_cover: $scope.shop.server_coupon[0].coupon[0].shop_cover,
                            shop_name: $scope.shop.server_coupon[0].coupon[0].shop_name
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
                                '<h4 class="flow-text green-text center">Nhận Coupon thành công</h4>' +
                                '<p style="text-align: center; margin-top: 0px;">Tải App Coupon để sử dụng coupon vừa nhận được !</p>' +
                                '<center><button type="button" class="waves-effect waves-light btn btn-coupon" ng-click="confirm(confirmValue)">Ok</button></center>',
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