import {myRequest} from "../../../function";
//设置用户信息
export const setUserInfo = info => ({
	type: "header/set_user_info",
	value: info
});
//改变当前位置
export const changeLocation = location => ({
	type: "header/change_location",
	value: location
});
//我的位置
export const changemyLocation = mylocation => ({
	type: "header/change_mylocation",
	value: mylocation
});
//获取用户信息
export const getUserInfo = () => {
	return dispatch => {
		myRequest({
			method: "get",
			path: "/consultant/user/index/consultant_info",
			auth: true,
			callback: function (response) {
				//处理返回结果
				if (response.data.code === 0) {
					//把用户信息写入数据仓库
					dispatch(setUserInfo(response.data.data));
				}
			}
		});
	};
};

//删除用户信息
export const unsetUserInfo = () => ({
	type: "header/unset_user_info"
});

//清除用户信息
export const clearUserInfo = () => {
	return dispatch => {
		//清除数据仓库用户信息
		dispatch(unsetUserInfo());
	};
};
