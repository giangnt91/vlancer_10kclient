var coupon = angular.module('CouponController', ['ngRoute', 'ngStorage', 'ngSanitize', 'CouponService', 'ngDialog', 'socialLogin', '720kb.socialshare'])
coupon
.filter('unsafe', function ($sce) { return $sce.trustAsHtml; })

.controller('LoginCtrl', function ($scope, $location, $rootScope, $window, DataServices, ngDialog, $timeout) {
	
	$timeout(function () {
		$scope.load_page = true;
	}, 500)
	
	$window.fbAsyncInit = function () {
		FB.XFBML.parse();
		// check load facebook login button
		var finished_rendering = function () {
			$scope.load_f = true;
			$scope.$apply();
		}
		FB.Event.subscribe('xfbml.render', finished_rendering);
	}
	
	$rootScope.$on('event:social-sign-in-success', function (event, userDetails) {
		Imgurl = "https://graph.facebook.com/" + userDetails.uid + "/picture?width=180&height=180";
		// get long live access token
		FB.api('/oauth/access_token?grant_type=fb_exchange_token&client_id=1946240225621730&client_secret=15ecc2d337244c224a6497f9b91931f1&fb_exchange_token=' + userDetails.token, function (res) {
			// localStorage.setItem('accessToken', res.access_token);
			$scope.access_token = res.access_token;
		});
		
		
		$timeout(function(){
			
			DataServices.signIn(userDetails.uid, Imgurl).then(function (signin_res) {
				var signin_result = signin_res.data;
				if (signin_result.error_code === 2) {
					
					$scope.info = [{
						fulname: userDetails.name,
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
					
					DataServices.signUp(userDetails.uid, Imgurl, JSON.stringify($scope.info), 0, 0, 5, JSON.stringify(_class), false, [], 0, 0, null, 5, [], null, JSON.stringify(_role), $scope.access_token, JSON.stringify(_status)).then(function (signup_res) {
						var signup_result = signup_res.data;
						if (signup_result.error_code === 0) {
							DataServices.signIn(userDetails.uid, Imgurl).then(function (signin_res_2) {
								var signin_result_2 = signin_res_2.data;
								if (signin_result_2.error_code === 0) {
									localStorage.setItem('auth', JSON.stringify(signin_result_2.auth));
									// window.location.href = '#/';
									$location.path('/');
									window.location.reload(true);
								}
							});
						}
					});
				}
				if (signin_result.error_code === 0) {
					// function update class user
					DataServices.updateClass(signin_result.auth[0]._id).then(function (response) {
					});
					// end function
					
					// check in loyal
					DataServices.checkIn(signin_result.auth[0]._id).then(function (re) {
						if (re.data.error_code === 0) {
							localStorage.removeItem('auth');
							localStorage.setItem('auth', JSON.stringify([re.data.auth]));
						}
					});
					
					// update accessToken
					DataServices.AccessToken(signin_result.auth[0]._id, $scope.access_token).then(function(are){
						if (are.data.error_code === 0) {
							localStorage.removeItem('auth');
							localStorage.setItem('auth', JSON.stringify([are.data.auth]));
						}
					})
					
					DataServices.Upname(userDetails.uid, userDetails.name).then(function () { });
					localStorage.setItem('auth', JSON.stringify(signin_result.auth));
					// window.location.href = '#/';
					$location.path('/');
					window.location.reload(true);
					} else if (signin_result.error_code === 5) {
					$scope._error_login = true;
					$timeout(function () {
						$scope._error_login = false;
					}, 5000)
				}
			});
			
		}, 500);
		
	})
})
.controller('HomeCtrl', function ($scope, $location, $window, $timeout, DataServices, socialLoginService, $filter) {
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
		
		if ($scope.auth[0].access_time_per_day[0].id === 1) {
			var $toastContent = $('<center>Bạn được cộng 50 điểm cho lần đầu đăng nhập trong ngày.</center>');
			Materialize.toast($toastContent, 4500);
		}
	}
	
	$scope.auth = JSON.parse(localStorage.getItem('auth'));
	
	DataServices.GetSlider().then(function (response) {
		if (response.data.error_code === 0) {
			$scope.Sliders = response.data.sliders;
		}
	});
	
	// go menu
	$scope.go_action = function () {
		// window.location.href = '#/action';
		$location.path('/thuc-hien-tac-vu');
		$window.scrollTo(0, 0);
		$timeout(function () {
			// window.location.reload(true);
		}, 100);
	}
	
	$scope.go_account = function () {
		// window.location.href = '#/account';
		$location.path('/quan-ly-tai-khoan');
		$window.scrollTo(0, 0);
		$timeout(function () {
			// window.location.reload(true);
		}, 100);
	}
	
	$scope.go_home = function () {
		// window.location.href = '#/';
		$location.path('/');
		$window.scrollTo(0, 0);
		$timeout(function () {
			window.location.reload(true);
		}, 100);
	}
	
	$scope.go_shop = function(){
		$scope.all_shop.forEach(element => {
			if(element.shop_boss === $scope.auth[0].user_id){
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
			else{
				if(element.shop_manager !== null && element.shop_manager.length > 0){
					element.shop_manager.forEach(el => {
						if(el.text === $scope.auth[0].user_id){
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
					})
				}
			}
		})
	}
	
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
	
	$scope.slider_go = function (data) {
	if (data.ShopId === null) {
	window.open(data.Url, '_blank');
	} else {
	$scope.all_shop.forEach(element => {
	if (element._id === data.ShopId) {
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
	
	// end go menu
	
	// auth
	$scope.login = function () {
	// window.location.href = '#/login';
	// FB.XFBML.parse();
	$window.scrollTo(0, 0);
	$location.path('/dang-nhap');
	$timeout(function () {
	window.location.reload(true);
	}, 500);
	}
	
	$timeout(function () {
	$scope.loading = true;
	}, 2500)
	
	
	$scope.logout = function () {
	// window.location.href = '#/login';
	socialLoginService.logout();
	$window.scrollTo(0, 0);
	localStorage.clear();
	$location.path('/dang-nhap');
	FB.XFBML.parse();
	$timeout(function () {
	window.location.reload(true);
	}, 10);
	}
	// end auth
	
	// get all basic code
	
	// lấy danh sách emarket
	DataServices.getEmarket().then(function (response) {
	if (response.data.error_code === 0) {
	$scope.emarketResult = response.data.emarket;
	}
	})
	
	DataServices.getBasiccode().then(function (response) {
	if (response.data.error_code === 0) {
	$scope.basicResult = response.data.basic;
	localStorage.setItem('basic', JSON.stringify($scope.basicResult));
	}
	});
	
	$scope.get_basic_detail = function (id) {
	$scope.basicResult.forEach(element => {
	if (element._id === id) {
	$scope.detail_basic = element;
	}
	});
	}
	
	$scope.go_ma_giam_gia = function (url) {
	window.open(url, '_blank');
	}
	
	$scope.go_detail_basic = function (id) {
	if ($scope.basicResult !== undefined) {
	$scope.basicResult.forEach(element => {
	if (id === element.Eid) {
	var slug = bo_dau_tv(element.Ename).split(' ').join('-');
	var _id = element.Eid.slice(-5);
	
	$location.path('/ma-giam-gia-pho-thong/' + slug + '-' + _id);
	$window.scrollTo(0, 0);
	FB.XFBML.parse();
	}
	});
	}
	}
	// end get all basic code
	
	// get all shop
	DataServices.getAllshop().then(function (response) {
	if (response.data.error_code === 0) {
	$scope.all_shop = response.data.shop;
	$scope.kind_result_1 = [];
	$scope.kind_result_2 = [];
	$scope.kind_result_3 = [];
	$scope.kind_result_0 = [];
	for (var i = 0; i < response.data.shop.length; i++) {
	if (response.data.shop[i].server_coupon.length > 0) {
	if (response.data.shop[i].server_coupon[0].coupon[0].loyal[0].id === 1) {
	$scope.kind_result_0.push(response.data.shop[i]);
	}
	}
	if (response.data.shop[i].shop_coupon.length > 0) {
	if (response.data.shop[i].shop_coupon[0].coupon[0].loyal[0].id === 1) {
	$scope.kind_result_0.push(response.data.shop[i]);
	}
	}
	
	
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
	
	$scope.kind_result_0 = $filter('orderBy')($scope.kind_result_0, ['server_coupon', 'shop_coupon'], true);
	$scope.kind_result_1 = $filter('orderBy')($scope.kind_result_1, ['server_coupon', 'shop_coupon'], true);
	$scope.kind_result_2 = $filter('orderBy')($scope.kind_result_2, ['server_coupon', 'shop_coupon'], true);
	$scope.kind_result_3 = $filter('orderBy')($scope.kind_result_3, ['server_coupon', 'shop_coupon'], true);
	
	
	localStorage.setItem('kind_0', JSON.stringify($scope.kind_result_0));
	localStorage.setItem('kind_1', JSON.stringify($scope.kind_result_1));
	localStorage.setItem('kind_2', JSON.stringify($scope.kind_result_2));
	localStorage.setItem('kind_3', JSON.stringify($scope.kind_result_3));
	localStorage.setItem('all_shop', JSON.stringify($scope.all_shop));
	}
	});
	
	$scope.detail_kind_0 = function () {
	// window.location.href = '#/cua-hang/mua-sam';
	$location.path('/khach-hang-than-thiet/danh-sach-cua-hang')
	$window.scrollTo(0, 0);
	$timeout(function () {
	// window.location.reload(true);
	}, 100);
	}
	
	$scope.detail_kind_1 = function () {
	// window.location.href = '#/cua-hang/mua-sam';
	$location.path('/mua-sam/danh-sach-cua-hang')
	$window.scrollTo(0, 0);
	$timeout(function () {
	// window.location.reload(true);
	}, 100);
	}
	
	$scope.detail_kind_2 = function () {
	// window.location.href = '#/cua-hang/an-uong';
	$location.path('/an-uong/danh-sach-cua-hang');
	$window.scrollTo(0, 0);
	$timeout(function () {
	// window.location.reload(true);
	}, 100);
	}
	
	$scope.detail_kind_3 = function () {
	// window.location.href = '#/cua-hang/du-lich';
	$location.path('/du-lich/danh-sach-cua-hang');
	$window.scrollTo(0, 0);
	$timeout(function () {
	// window.location.reload(true);
	}, 100);
	}
	// end get all shop
	
	})									