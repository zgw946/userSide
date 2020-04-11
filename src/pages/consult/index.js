import React, {Component, Fragment} from "react";
import Loadable from "react-loadable";
import Loading from "../../components/common/loading";
import connect from "react-redux/lib/connect/connect";

//引入组件
const Online = Loadable({
  loader: () => import("./online"),
  loading: Loading
}); //在线咨询
const Robot = Loadable({
  loader: () => import("./robot"),
  loading: Loading
}); //机器人咨询

class Consult extends Component {
  render() {
    const {userInfo} = this.props; //用户信息

    return (
        <Fragment>
          {
            //根据是否登录判断展示的组件
            userInfo ? (
              <Online/>
            ) : (
              <Robot/>
            )
          }
        </Fragment>
    );
  }
}

const mapState = state => {
  return {
    userInfo: state.getIn(["header", "userInfo"]) //用户信息
  };
};

Consult = connect(mapState)(Consult);

export default Consult;
