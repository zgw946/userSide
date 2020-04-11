import {fromJS} from "immutable";
const defaultState = fromJS({
	showBox: fromJS([]), //需要打开的弹出框
});
export default (state = defaultState, action) => {
	switch (action.type) {
		case "popup/change_popup_box": //打开或关闭相应弹出框
			let newWindow = fromJS(action.value); //需要打开的新窗口
			let showBox = state.get("showBox"); //现有的窗口
			//判断新窗口是否为空数组，是则关闭所有窗口
			if (newWindow.size <= 0) {
				return state.set("showBox", newWindow);
			} else {
				let newBox = showBox; //新容器
				//判断该窗口是否已打开，否则打开
				newWindow.map(item => {
					let existsIndex = -1; //已存在的索引
					showBox.map((itemChild, index) => {
						if (item.get("type") === itemChild.get("type")) {
							existsIndex = index;
						}
						return null;
					});
					//如果不存在,则打开，否则关闭
					if (existsIndex > -1) {
						newBox = newBox.delete(existsIndex);
					} else {
						newBox = newBox.push(item);
					}

					return null;
				});

				return state.set("showBox", newBox);
			}

		default:
			return state;
	}
};
