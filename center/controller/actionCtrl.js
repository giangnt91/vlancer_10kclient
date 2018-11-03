coupon
.controller('ActionCtrl', function ($scope, $location, ngDialog, DataServices, $timeout, $filter, $window) {
	let Auth = localStorage.getItem('auth');
	if(Auth !== "undefined" && Auth !== null){
		DataServices.signIn(Auth[0].user_id, Auth[0].user_img).then(function (response) {
			var signin_result = response.data;
			if( signin_result.error_code === 5 || signin_result.error_code === 2){
				$location.path('/');
				window.location.reload(true);
			}else if( signin_result.error_code === 0){
				$scope.auth = signin_result.auth;
			}
		});
	}
	
	var date = new Date();
	var today = $filter('date')(new Date(), 'dd/MM/yyyy');
	//thay đổi điểm tại đây
	var action_point = 500;
	
	$scope.xacnhan = function () {
		DataServices.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
			var signin_result = response.data;
			localStorage.setItem('auth', JSON.stringify(signin_result.auth));
			window.location.reload(true);
		});
		$location.path('/thuc-hien-tac-vu')
		$window.scrollTo(0, 0);
	}
	
	if (!$scope.auth) {
		
        } else {
		
		// check feedback
		if ($scope.auth[0].use_coupon.length > 0) {
			// $scope.feedback_count = 0;
			for (var i = 0; i < $scope.auth[0].use_coupon.length; i++) {
				if ($scope.auth[0].use_coupon[i].feedback === null) {
					$scope.condition = true;
					// $scope.feedback_count = + 1;
                    } else {
					$scope.condition = false;
				}
			}
		}
		// END CHECK FEEDBACK
		
		// ACTION PER DAY
		DataServices.getActionperday($scope.auth[0].user_id).then(function (response) {
			if (response.data.list_action_per_day !== null) {
				if (response.data.list_action_per_day.length > 0) {
					$scope.list_action_per_day = response.data.list_action_per_day;
					
					
					// show data
					$scope.data = $scope.list_action_per_day[0];
					$scope.index = 0;
					$scope.next_arr = $scope.list_action_per_day.slice(1);
					
					$scope.array_like = [];
					$scope.array_com = [];
					$scope.array_like_skip = [];
					$scope.array_com_skip = [];
					$scope.array_error = [];
					
					$timeout(function(){
						//check comment after comment
						FB.api('/' + $scope.data.action_shop_id + '_' + $scope.data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
							var comment = response.summary;
							// if (comment.total_count) {
							$scope.pre_comment = comment.total_count;
							// console.log('binh luan 1 truoc khi comment: ' + $scope.pre_comment, 'shop id: ' + last_data.action_shop_id);
							// }
						});
					}, 100)
					
					
					$scope.next_action = function () {
						var reaction_kind = [];
						$scope.reaction_point = 0;
						$scope.show_action = true;
						
						if ($scope.list_action_per_day.length > 1) {
							if ($scope.index === 0) {
								$scope.pre_data = $scope.data;
								var last_data = $scope.data;
								$scope.data = $scope.next_arr[$scope.index];
								//check comment after comment
								FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
									var comment = response.summary;
									// if (comment.total_count) {
									$scope.pre_comment = comment.total_count;
									// console.log('binh luan 1 truoc khi comment: ' + $scope.pre_comment, 'shop id: ' + last_data.action_shop_id);
									// }
								});
								
								//update action user
								DataServices.updateActionuser(last_data._id, $scope.auth[0].user_id).then(function (response) { });
                                } else {
								if ($scope.index < $scope.next_arr.length) {
									
									// function check face
									var last_data = $scope.pre_data;
									
									//update action user
									DataServices.updateActionuser(last_data._id, $scope.auth[0].user_id).then(function (response) { });
									
									function check_face() {
										//CHECK LIKE
										FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/reactions?summary=true&access_token=' + $scope.auth[0].access_token, (response) => {
											reaction_kind = {
												id: 1,
												name: 'like'
											}
											
											var tmp_reaction = 'NONE';
											var result_reaction = response.summary.viewer_reaction;
											var compare_reaction = tmp_reaction.localeCompare(result_reaction);
											
											if (compare_reaction !== 0) {
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, $scope.pre_data.action_shop_id, $scope.auth[0]._id, 1).then(function (response) {
													if (response.data.error_code === 0) {
														DataServices.Point($scope.auth[0]._id, action_point, 0).then(function (response) {
															if (response.data.error_code === 0) {
																$scope.reaction_point = $scope.reaction_point + action_point;
															}
														});
														$scope.array_like.push(last_data.action_url);
                                                        } else {
														$scope.array_error.push(last_data.action_url);
													}
												});
                                                } else {
												reaction_kind = {
													id: 3,
													name: 'skip'
												}
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, last_data.action_shop_id, $scope.auth[0]._id, 0).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.array_like_skip.push(last_data.action_url);
                                                        } else {
														$scope.array_error.push(last_data.action_url);
													}
												});
											}
											
										});
										//END CHECK LIKE
										
										
										//CHECK COMMENT
										FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
											var comment = response.summary;
											reaction_kind = {
												id: 2,
												name: 'comment'
											}
											// console.log('binh luan 1 sau khi comment: ' + comment.total_count, 'shop id: ' + last_data.action_shop_id);
											if (comment.total_count > $scope.pre_comment) {
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, $scope.pre_data.action_shop_id, $scope.auth[0]._id, 2).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.array_com.push(last_data.action_url);
													}
												});
												DataServices.Point($scope.auth[0]._id, action_point, 0).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.reaction_point = $scope.reaction_point + action_point;
													}
												});
                                                } else {
												reaction_kind = {
													id: 3,
													name: 'skip'
												}
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, last_data.action_shop_id, $scope.auth[0]._id).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.array_com_skip.push(last_data.action_url);
                                                        } else {
														$scope.array_error.push(last_data.action_url);
													}
												});
											}
										});
										//END CHECK COMMENT
									}
									
									check_face();
									// end function
									
									// function update class user
									$timeout(function () {
										DataServices.updateClass($scope.auth[0]._id).then(function (response) {
										});
									}, 2000)
									// end function
									
									$scope.pre_data = $scope.next_arr[$scope.index - 1];
									$scope.data = $scope.next_arr[$scope.index];
									
									//check comment after comment
									FB.api('/' + $scope.pre_data.action_shop_id + '_' + $scope.pre_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
										var comment = response.summary;
										// if (comment.total_count) {
										$scope.pre_comment = comment.total_count;
										// console.log('binh luan 2 truoc khi comment: ' + comment.total_count, 'shop id: ' + $scope.pre_data.action_shop_id);
										// }
									});
									
                                    } else {
									$scope.off_next = true;
									
									// function check face
									var last_data = $scope.pre_data;
									
									//update action user
									DataServices.updateActionuser(last_data._id, $scope.auth[0].user_id).then(function (response) { });
									
									function check_face() {
										//CHECK LIKE
										FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/reactions?summary=true&access_token=' + $scope.auth[0].access_token, (response) => {
											reaction_kind = {
												id: 1,
												name: 'like'
											}
											
											var tmp_reaction = 'NONE';
											var result_reaction = response.summary.viewer_reaction;
											var compare_reaction = tmp_reaction.localeCompare(result_reaction);
											
											if (compare_reaction !== 0) {
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, $scope.pre_data.action_shop_id, $scope.auth[0]._id, 1).then(function (response) {
													if (response.data.error_code === 0) {
														DataServices.Point($scope.auth[0]._id, action_point, 0).then(function (response) {
															if (response.data.error_code === 0) {
																$scope.reaction_point = $scope.reaction_point + action_point;
															}
														});
														$scope.array_like.push(last_data.action_url);
                                                        } else {
														$scope.array_error.push(last_data.action_url);
													}
												});
                                                } else {
												reaction_kind = {
													id: 3,
													name: 'skip'
												}
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, last_data.action_shop_id, $scope.auth[0]._id, 0).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.array_like_skip.push(last_data.action_url);
                                                        } else {
														$scope.array_error.push(last_data.action_url);
													}
												});
											}
											
										});
										//END CHECK LIKE
										
										
										//CHECK COMMENT
										
										FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
											var comment = response.summary;
											reaction_kind = {
												id: 2,
												name: 'comment'
											}
											// console.log('binh luan 2 sau khi comment: ' + comment.total_count, 'shop id: ' + last_data.action_shop_id);
											if (comment.total_count > $scope.pre_comment) {
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, $scope.pre_data.action_shop_id, $scope.auth[0]._id, 2).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.array_com.push(last_data.action_url);
													}
													
												});
												
												DataServices.Point($scope.auth[0]._id, action_point, 0).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.reaction_point = $scope.reaction_point + action_point;
													}
												});
                                                } else {
												reaction_kind = {
													id: 3,
													name: 'skip'
												}
												DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, last_data.action_shop_id, $scope.auth[0]._id, 0).then(function (response) {
													if (response.data.error_code === 0) {
														$scope.array_com_skip.push(last_data.action_url);
                                                        } else {
														$scope.array_error.push(last_data.action_url);
													}
												});
											}
										});
										//END CHECK COMMENT
									}
									
									check_face();
									// end function
									
									// function update class user
									$timeout(function () {
										DataServices.updateClass($scope.auth[0]._id).then(function (response) {
										});
									}, 2000)
									// end function
									
									$scope.pre_data = $scope.list_action_per_day[$scope.index];
									
									//check comment after comment
									FB.api('/' + $scope.pre_data.action_shop_id + '_' + $scope.pre_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
										var comment = response.summary;
										$scope.pre_comment = comment.total_count;
										
									});
								}
							}
                            } else {
							$scope.pre_data = $scope.data;
							var last_data = $scope.data;
							
							//update action user
							DataServices.updateActionuser(last_data._id, $scope.auth[0].user_id).then(function (response) { });
							
							$scope.data = $scope.next_arr[$scope.index];
							//check comment after comment
							FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
								var comment = response.summary;
								$scope.pre_comment = comment.total_count;
							});
							$scope.off_next = true;
						}
						
						$scope.index++;
						FB.XFBML.parse();
					}						
					
					$scope.complete = function () {
						var reaction_kind = [];
						
						// function check face
						var last_data = $scope.pre_data;
						
						//update action user
						DataServices.updateActionuser(last_data._id, $scope.auth[0].user_id).then(function (response) { });
						
						$scope.dialog = ngDialog.open({
							template:
							'<h4 class="flow-text center">Đang xử lý dữ liệu</h4>  <div class="progress"> <div class="indeterminate"></div> </div>',
							plain: true,
							showClose: false,
							closeByDocument: false
						});
						
						function check_face() {
							//CHECK LIKE
							FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/reactions?summary=true&access_token=' + $scope.auth[0].access_token, (response) => {
								reaction_kind = {
									id: 1,
									name: 'like'
								}
								
								var tmp_reaction = 'NONE';
								var result_reaction = response.summary.viewer_reaction;
								var compare_reaction = tmp_reaction.localeCompare(result_reaction);
								
								if (compare_reaction !== 0) {
									DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, $scope.pre_data.action_shop_id, $scope.auth[0]._id, 1).then(function (response) {
										if (response.data.error_code === 0) {
											DataServices.Point($scope.auth[0]._id, action_point, 0).then(function (response) {
												if (response.data.error_code === 0) {
													$scope.reaction_point = $scope.reaction_point + action_point;
												}
											});
											$scope.array_like.push(last_data.action_url);
                                            } else {
											$scope.array_error.push(last_data.action_url);
										}
									});
                                    } else {
									reaction_kind = {
										id: 3,
										name: 'skip'
									}
									DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, last_data.action_shop_id, $scope.auth[0]._id, 0).then(function (response) {
										if (response.data.error_code === 0) {
											$scope.array_like_skip.push(last_data.action_url);
                                            } else {
											$scope.array_error.push(last_data.action_url);
										}
									});
								}
								
							});
							//END CHECK LIKE
							
							
							//CHECK COMMENT
							
							FB.api('/' + last_data.action_shop_id + '_' + last_data.action_id + '/comments?summary=true&order=reverse_chronological&access_token=' + $scope.auth[0].access_token, (response) => {
								var comment = response.summary;
								reaction_kind = {
									id: 2,
									name: 'comment'
								}
								// console.log('binh luan 3 sau khi comment: ' + comment.total_count, 'shop id: ' + last_data.action_shop_id);
								if (comment.total_count > $scope.pre_comment) {
									DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, $scope.pre_data.action_shop_id, $scope.auth[0]._id, 2).then(function (response) {
										if (response.data.error_code === 0) {
											$scope.array_com.push(last_data.action_url);
										}
										
									});
									
									DataServices.Point($scope.auth[0]._id, action_point, 0).then(function (response) {
										if (response.data.error_code === 0) {
											$scope.reaction_point = $scope.reaction_point + action_point;
										}
									});
                                    } else {
									reaction_kind = {
										id: 3,
										name: 'skip'
									}
									DataServices.createReaction(JSON.stringify(reaction_kind), last_data.action_id, last_data.action_url, today, last_data.action_shop_id, $scope.auth[0]._id, 0).then(function (response) {
										if (response.data.error_code === 0) {
											$scope.array_com_skip.push(last_data.action_url);
                                            } else {
											$scope.array_error.push(last_data.action_url);
										}
									});
								}
							});
							//END CHECK COMMENT
						}
						
						check_face();
						// end function
						$timeout(function () {
							$window.scrollTo(0, 0);
							$scope.dialog.close();
							$scope.com_ac = true;
						}, 500)
						
						// function update class user
						$timeout(function () {
							DataServices.updateClass($scope.auth[0]._id).then(function (response) {
							});
						}, 2000)
						// end function
					}
					// end show data
					
					if (response.data.device === "phone") {
						$scope.width_post = 'auto';
                        } else {
						$scope.width_post = 510;
					}
                    } else {
					$scope.empty_slot = true;
				}
				
                } else {
				$scope.full_point = true;
			}
		});
	}
})