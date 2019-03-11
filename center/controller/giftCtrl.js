coupon
  .controller('GiftsCtrl', function ($scope, DataServices, $location, $window, $routeParams) {

    // Lấy danh sách quà tặng
    DataServices.giftGetAll().then(response => {
      if (response.data.error_code === 0) {
        $scope.gifts = response.data.gifts;
        var pagesShown = 1;
        var pageSize = 12;
        $scope.items = $scope.gifts;
        $scope.itemsLimit = function () {
          return pageSize * pagesShown;
        };
        $scope.hasMoreItemsToShow = function () {
          return pagesShown < ($scope.items.length / pageSize);
        };
        $scope.showMoreItems = function () {
          pagesShown = pagesShown + 1;
        };
      }
    });

    // tới trang xem chi tiết quà
    $scope.goGiftDetail = (_id) => {
      $location.url('/qua?id=' + _id)
      $window.scrollTo(0, 0);
    }
  })

  .controller('GiftCtrl', function ($scope, DataServices, $location, $filter, $timeout, $routeParams, Thesocket) {
    $scope.auth = JSON.parse(localStorage.getItem('auth'));
    $scope.isLoading = false;
    $timeout(() => {
      $scope.isLoading = true;
    }, 2500)
    const _id = $routeParams.id;

    // kiểm tra qùa đã nhân
    Array.prototype.gift = function (obj) {
      var i = this.length;
      while (i--) {
        if (this[i].giftTurn === obj) {
          return true;
        }
      }
      return false;
    }

    function formatDayIso(dayFormat) {
      let parts = dayFormat.split("/");
      let iday = parseInt(parts[0]) + 1;
      return parts[1] + '-' + iday + '-' + parts[2];
    }

    checkConditionGetGift = () => {
      $scope.isGetGift = true;
      $scope.isGiftTaken = true;
      if ($scope.auth) {
        $scope.isShop = true;
        $scope.isPoint = true;

        // kiểm tra đã nhận quà hay chưa
        if ($scope.auth[0].gifts.gift($scope.giftDetail.giftTurn) !== false) {
          $scope.isGiftTaken = false;
          $scope.isGetGift = false;
        }

        // kiểm tra có đủ điểm không
        if ($scope.auth[0].point_plus < $scope.giftDetail.giftPoint) {
          $scope.isPoint = false;
          $scope.isGetGift = false;
        }

        // kiểm tra đã feedback hay chưa
        if ($scope.auth[0].use_coupon.length > 0) {
          $scope.feedback_count = 0;
          for (var i = 0; i < $scope.auth[0].use_coupon.length; i++) {
            if ($scope.auth[0].use_coupon[i].rfeedback[0].id === 1) {
              if ($scope.auth[0].use_coupon[i].feedback === null || $scope.auth[0].use_coupon[i].feedback === "") {
                $scope.feedback_count = + 1;
                $scope.isGetGift = false;
              }
            }
          }
        }

        // kiểm tra là chủ shop hoặc manager
        if ($scope.auth[0].role[0].id !== 0) {
          $scope.isShop = false;
          $scope.isGetGift = false;
        }
      } else {
        $scope.isGiftTaken = false;
        $scope.isGetGift = false;
      }
    }

    // lấy chi tiếc quà tặng
    getGiftDetail = () => {
      DataServices.giftGetDetail(_id).then(response => {
        if (response.data.error_code === 0) {
          $scope.giftDetail = response.data.gift;
          checkConditionGetGift();
        }
      })
    }
    getGiftDetail();

    // lấy quà tặng
    $scope.getGift = async () => {
      let today = $filter('date')(new Date(), 'dd/MM/yyyy');
      let todayIso = formatDayIso(today);

      let getUser = {
        id: $scope.auth[0]._id,
        name: $scope.auth[0].info[0].fulname,
        image: $scope.auth[0].user_img,
        getDay: today
      }

      $scope.giftDetail.giftUserHasTaken = $scope.giftDetail.giftUserHasTaken + 1;
      if ($scope.giftDetail.giftListUser === null) {
        $scope.giftDetail.giftListUser = [getUser];
      } else {
        $scope.giftDetail.giftListUser.push(getUser);
      }

      // cập nhật quà tặng sau khi user đã lấy lấy
      await DataServices.giftEdit($scope.giftDetail).then({});

      // cập nhật danh sách quà và điểm của user
      let newGift = {
        _id: $scope.giftDetail._id,
        giftShop: $scope.giftDetail.giftShop,
        giftName: $scope.giftDetail.giftName,
        giftPrice: $scope.giftDetail.giftPrice,
        giftPoint: $scope.giftDetail.giftPoint,
        giftInfo: $scope.giftDetail.giftInfo,
        giftCreateDay: $scope.giftDetail.giftCreateDay,
        giftCreateDayIso: $scope.giftDetail.giftCreateDayIso,
        giftExpiredDay: $scope.giftDetail.giftExpiredDay,
        giftExpiredDayIso: $scope.giftDetail.giftExpiredDayIso,
        giftAddress: $scope.giftDetail.giftAddress,
        giftImages: $scope.giftDetail.giftImages,
        giftTurn: $scope.giftDetail.giftTurn,
        giftGetDay: today,
        giftUse: false,
        giftDisable: false
      }

      if ($scope.auth[0].gifts.length > 0) {
        $scope.auth[0].gifts.push(newGift);
      } else {
        $scope.auth[0].gifts = [newGift];
      }
      $scope.auth[0].point_plus = $scope.auth[0].point_plus - $scope.giftDetail.giftPoint;
      // cập nhật quà của user vừa lấy
      await DataServices.giftUpdateUserGet($scope.auth[0]).then(response => {
        if (response.data.error_code === 0) {

          Thesocket.emit('user_get_gift', $scope.auth[0]._id);

          DataServices.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
            var signin_result = response.data;
            localStorage.setItem('auth', JSON.stringify(signin_result.auth));
            $scope.auth = signin_result.auth;
          });

          checkConditionGetGift();
        }
      })
    }

  })