coupon
    .controller('AccountCtrl', function ($scope, $window, DataServices, $timeout, ngDialog) {
		let Auth = localStorage.getItem('auth');
		if(Auth !== "undefined" && Auth !== null){
			$scope.auth = JSON.parse(Auth);
		}
		

		$scope.Sex = [{
			id: null,
			name: 'Chọn Giới Tính'
			},{
			id: 1,
			name: 'Nam'
		},{
			id: 2,
			name: 'Nữ'
		},{
			id: 3,
			name: 'Khác'
		}]	
		
		$scope.openUpdate = function(){
			if($scope.auth[0].info[0].sex === 'Chưa cập nhật'){
				$scope.selectSex = $scope.Sex[0];
			}else if($scope.auth[0].info[0].sex === 'Nam'){
				$scope.selectSex = $scope.Sex[1];
			}else if($scope.auth[0].info[0].sex === 'Nữ'){
				$scope.selectSex = $scope.Sex[2];
			}else if($scope.auth[0].info[0].sex === 'Khác'){
				$scope.selectSex = $scope.Sex[3];
			}
		}
        // $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.update = function (data) {
		
		console.log($scope.selectSex);
		
            $scope.dialog = ngDialog.open({
                template:
                    '<h4 class="flow-text center">Đang cập nhật dữ liệu</h4>  <div class="progress"> <div class="indeterminate"></div> </div>',
                plain: true,
                showClose: false,
                closeByDocument: false
            });
			
			var sex;
            var email = data[0].info[0].email;
			
			if($scope.selectSex.value !== null){
				sex = $scope.selectSex.name;
			}else{
				sex = data[0].info[0].sex;
			}
			
            var mobile = data[0].info[0].mobile;
            var work = data[0].info[0].work;
            var bithday = data[0].info[0].bith_day;
            var full_update;
            var point = 10;

            //check data after update
            if (data !== undefined) {

                // if (data.email === undefined || data.email === null) {
                    // email = $scope.auth[0].info[0].email;
                // } else {
                    // email = data.email;
                // }

                // if (data.sex === undefined || data.sex === null) {
                    // sex = $scope.auth[0].info[0].sex;
                // } else {
                    // sex = data.sex;
                // }

                // if (data.mobile === undefined || data.mobile === null) {
                    // mobile = $scope.auth[0].info[0].mobile;
                // } else {
                    // mobile = "0" + data.mobile;
                // }

                // if (data.work === undefined || data.work === null) {
                    // work = $scope.auth[0].info[0].work;
                // } else {
                    // work = data.work;
                // }

                // if (data.bithday === undefined || data.bithday === null) {
                    // bithday = $scope.auth[0].info[0].bith_day;
                // } else {
                    // bithday = data.bithday;
                // }

                if ($scope.auth[0].info[0].full_update === 0) {
                    if (email === "Chưa cập nhật" || sex === "Chưa cập nhật" || mobile === "Chưa cập nhật" || work === "Chưa cập nhật" || bithday === "Chưa cập nhật") {
                        full_update = 0;
                    } else {
                        full_update = 1;
                    }
                } else {
                    full_update = 2;
                }

                $timeout(function () {
                    //send data update to server
                    DataServices.Update($scope.auth[0]._id, $scope.auth[0].info[0].fulname, email, sex, mobile, work, bithday, full_update).then(function (response) {
                        if (response.data.error_code === 0) {

                            $scope.dialog = ngDialog.openConfirm({
                                template:
                                    '<h4 class="flow-text green-text center">Cập nhật thông tin thành công</h4> <br>' +
                                    '<center><button type="button" class="waves-effect waves-light btn" style="" ng-click="confirm(confirmValue)">Ok</button></center>',
                                plain: true,
                                showClose: false,
                                closeByDocument: false
                            }).then(function (comfirm) {
                                $timeout(function () {
                                    DataServices.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (signin_res_2) {
                                        var signin_result_2 = signin_res_2.data;

                                        if (signin_result_2.error_code === 0) {
                                            if (signin_result_2.auth[0].info[0].full_update === 1) {
                                                DataServices.Point($scope.auth[0]._id, point, 1).then(function (response_2) {
                                                    if (response_2.data.error_code === 0) {
                                                        DataServices.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (signin_res_3) {
                                                            var signin_result_3 = signin_res_3.data;
                                                            localStorage.setItem('auth', JSON.stringify(signin_result_3.auth));
                                                            $window.scrollTo(0, 0);
                                                            $scope.auth = JSON.parse(localStorage.getItem('auth'));
                                                            $timeout(function () {
                                                                $scope.$apply();
                                                            }, 100);
                                                            window.location.reload(true);
                                                        });
                                                    }
                                                });
                                                // function update class user
                                                DataServices.updateClass($scope.auth[0]._id).then(function (response) {
                                                });
                                            } else {
                                                localStorage.setItem('auth', JSON.stringify(signin_result_2.auth));
                                                $window.scrollTo(0, 0);
                                                $scope.auth = JSON.parse(localStorage.getItem('auth'));
                                                $timeout(function () {
                                                    $scope.$apply();
                                                }, 100);
                                                window.location.reload(true);
                                            }
                                        }
                                    });
                                }, 500);
                            });
                        } else {
                            $scope.dialog = ngDialog.open({
                                template:
                                    '<h4 class="red-text flow-text center">Có lỗi trong quá trình xử lý !</h4>',
                                plain: true,
                                showClose: false,
                                closeByDocument: false
                            });
                        }
                    });
                    $scope.dialog.close();
                }, 3000);

            }
        }
    });