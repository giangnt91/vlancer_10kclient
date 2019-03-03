angular.module('CouponService', [])
	.factory('DataServices', function ($http, $q) {
		var api_gateway_url = 'https://api.coupon10k.com';
		// var api_gateway_url = 'http://35.244.36.175:2018';
		// var api_gateway_url = 'http://localhost:2018';
		var parameter;
		var url;
		var header = { header: { 'Conntent-Type': 'application/x-www-form-urlencoded' } };

		return {
			getAuthToken: function () {
				url = api_gateway_url + '/authtoken';
				return $http.post(url, parameter, header);
			},
			checkIn: function (_id) {
				parameter = JSON.stringify({
					_id: _id
				});
				url = api_gateway_url + '/checkin';
				return $http.post(url, parameter, header);
			},
			signIn: function (user_id, user_img) {
				parameter = JSON.stringify({
					user_id: user_id,
					user_img: user_img
				});
				url = api_gateway_url + '/signin';
				return $http.post(url, parameter, header);
			},
			signUp: function (user_id, user_img, info, point_per_day, point_per_today, total_slot, _class, download, access_time_per_day, point_plus, point_bad, total_list_coupon, empty_slot, use_coupon, call_server_in_day, role, access_token, _status) {
				parameter = JSON.stringify({
					user_id: user_id,
					user_img: user_img,
					info: info,
					point_per_day: point_per_day,
					point_per_today: point_per_today,
					total_slot: total_slot,
					user_class: _class,
					download: download,
					access_time_per_day: access_time_per_day,
					point_plus: point_plus,
					point_bad: point_bad,
					total_list_coupon: total_list_coupon,
					empty_slot: empty_slot,
					use_coupon: use_coupon,
					call_server_in_day: call_server_in_day,
					role: role,
					access_token: access_token,
					_status: _status
				});
				url = api_gateway_url + '/signup';
				return $http.post(url, parameter, header);
			},
			AccessToken: function (_id, access_token) {
				parameter = JSON.stringify({
					_id: _id,
					access_token: access_token
				})
				url = api_gateway_url + '/accesstoken';
				return $http.post(url, parameter, header);
			},
			Minuspoints: function (_id, point) {
				parameter = JSON.stringify({
					_id: _id,
					point: point
				})
				url = api_gateway_url + '/minuspoints';
				return $http.post(url, parameter, header);
			},
			Update: function (_id, fulname, email, sex, mobile, work, bithday, full_update) {
				parameter = JSON.stringify({
					_id: _id,
					fulname: fulname,
					email: email,
					sex: sex,
					mobile: mobile,
					work: work,
					bithday: bithday,
					full_update: full_update
				});
				url = api_gateway_url + '/updatepro';
				return $http.post(url, parameter, header);
			},
			Upname: function (userid, fulname) {
				parameter = JSON.stringify({
					userid: userid,
					fulname: fulname
				});
				url = api_gateway_url + '/updatename';
				return $http.post(url, parameter, header);
			},
			Point: function (_id, point, action_point) {
				parameter = JSON.stringify({
					_id: _id,
					point: point,
					action_point: action_point
				});
				url = api_gateway_url + '/plus';
				return $http.post(url, parameter, header);
			},
			Bad: function (_id) {
				parameter = JSON.stringify({
					_id: _id
				});
				url = api_gateway_url + '/bad';
				return $http.post(url, parameter, header);
			},
			updateClass: function (_id) {
				parameter = JSON.stringify({
					_id: _id
				});
				url = api_gateway_url + '/updateClass';
				return $http.post(url, parameter, header);
			},
			getBasiccode: function () {
				url = api_gateway_url + '/getbasic';
				return $http.post(url, parameter, header);
			},
			getAllshop: function () {
				url = api_gateway_url + '/getshop';
				return $http.post(url, parameter, header);
			},
			getByshopid: function (_id) {
				parameter = JSON.stringify({ _id: _id });
				url = api_gateway_url + '/getByshopid';
				return $http.post(url, parameter, header);
			},
			getshopvip: function () {
				url = api_gateway_url + '/getshopvip';
				return $http.post(url, parameter, header);
			},
			updateCoupon: function (_id, the_issuer, new_list_coupon, user_coupon, user_id, total_slot) {
				parameter = JSON.stringify({
					_id: _id,
					user_id: user_id,
					the_issuer: the_issuer,
					user_coupon: user_coupon,
					new_list_coupon: new_list_coupon,
					total_slot: total_slot
				});
				url = api_gateway_url + '/updatecoupon';
				return $http.post(url, parameter, header);
			},
			updateshopLike: function (_id, user_id, user_name) {
				parameter = JSON.stringify({
					_id: _id,
					user_id: user_id,
					user_name: user_name
				});
				url = api_gateway_url + '/updateshopLike';
				return $http.post(url, parameter, header);
			},
			getActionperday: function (user_id) {
				parameter = JSON.stringify({
					user_id: user_id
				});
				url = api_gateway_url + '/get_action_for_user_per_day';
				return $http.post(url, parameter, header);
			},
			updateActionuser: function (_id, user_id) {
				parameter = JSON.stringify({
					_id: _id,
					user_id: user_id
				});
				url = api_gateway_url + '/updateactionuser';
				return $http.post(url, parameter, header);
			},
			createReaction: function (kind_reaction, id_post_reaction, url_post_reaction, click_reaction_day, id_shop, id_user, _id) {
				parameter = JSON.stringify({
					kind_reaction: kind_reaction,
					id_post_reaction: id_post_reaction,
					url_post_reaction: url_post_reaction,
					click_reaction_day: click_reaction_day,
					id_shop: id_shop,
					id_user: id_user,
					_id: _id
				});
				url = api_gateway_url + '/creaction';
				return $http.post(url, parameter, header);
			},
			getEmarket: function () {
				url = api_gateway_url + '/getemarket';
				return $http.post(url, parameter, header);
			},
			GetSlider: function () {
				url = api_gateway_url + '/getslider';
				return $http.post(url, parameter, header);
			},

			TransactionGetByUserId: (userId) => {
				url = api_gateway_url + '/transactiongetbyuser?userid=' + userId;
				return $http.get(url, header);
			},

			hotDealGetAll: () => {
				url = api_gateway_url + '/gethotdeal';
				return $http.get(url, header);
			},

			giftGetAll: () => {
				url = api_gateway_url + '/getgifts';
				return $http.get(url, header);
			},

			giftGetDetail: (_id) => {
				url = api_gateway_url + '/getgift?_id=' + _id;
				return $http.get(url, header);
			},

			giftEdit: (gift) => {
				url = api_gateway_url + '/editgift';
				parameter = JSON.stringify({
					gift: gift
				})
				return $http.post(url, parameter, header);
			},

			giftUpdateUserGet: (auth) => {
				url = api_gateway_url + '/updateusergetgift';
				parameter = JSON.stringify({
					auth: auth
				})
				return $http.post(url, parameter, header);
			}
		}
	})

	.factory('Thesocket', function (socketFactory) {
		var api_gateway_url = 'https://api.coupon10k.com';
		// var api_gateway_url = 'http://35.244.36.175:2018';
		var socketConnection = io.connect(api_gateway_url);
		var socket = socketFactory({
			ioSocket: socketConnection
		});
		return socket;
	})
