import {fromJS} from "immutable";

const defaultState = fromJS({
  userInfo: null, //用户信息
  // 选择位置
  location: {
    province: {
      id: 6,
      name: "广东"
    },
    city: {
      id: 77,
      name: "深圳"
    },
    area: {
      id: 705,
      name: "福田区"
    }
  },
  // 我的位置
  mylocation: {
    province: {
      id: 6,
      name: "广东"
    },
    city: {
      id: 77,
      name: "深圳"
    },
    area: {
      id: 705,
      name: "福田区"
    }
  }
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case "header/set_user_info": //设置用户信息
      return state.set("userInfo", action.value);
    case "header/change_location": //改变当前位置
      return state.set("location", action.value);
    case "header/change_mylocation": //我的位置
      return state.set("mylocation", action.value);
    case "header/unset_user_info": //删除用户信息
      return state.set("userInfo", null);
    default:
      return state;
  }
};
