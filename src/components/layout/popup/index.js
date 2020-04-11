import React, {Fragment, PureComponent} from "react";
import {connect} from "react-redux";
import {changePopupBox} from "./actionCreators";

//引入组件
import PublicOpen from "./public_open"; //发布公开咨询
import Login from "./login"; //登录框
import Schedule from "./schedule"; //我的日程
import ChangeAvatar from "./change_avatar"; //修改头像
import UpdatePassword from "./update_password"; //修改密码
import ForgetPassword from "./forgetpassword"; //忘记密码
import BindMobile from "./bind_mobile"; //绑定手机
import Location from "./location"; //定位
import Subtract from "./subtract"; //解除绑定
import Specialist from "./specialist"; //专家咨询
import Folder from "./folder"; //文件夹
import DynamicFile from "./dynamicFile"; //新增案件
import Appointment from "./appointment"; // 预约案件
import Modification from "./modification"; // 修改预约
import PubliCmake from "./publiCmake"; // 发布预约
import Setpassword from "./setpassword"; // 设置密码

class Index extends PureComponent {
  render() {
    return (
        <Fragment>
          {this.props.showBox.map(item => (
              <div key={item.get("type")}>
                {(() => {
                  switch (item.get("type")) {
                    case "public_open":
                      return <PublicOpen popupType={item.get("type")}/>;
                    case "login":
                      return (
                          <Login
                              popupType={item.get("type")}
                              jumpLink={item.get("extra")}
                          />
                      );
                    case "schedule":
                      return <Schedule popupType={item.get("type")}/>;
                    case "change_avatar":
                      return <ChangeAvatar popupType={item.get("type")}/>;
                    case "update_password":
                      return <UpdatePassword popupType={item.get("type")}/>;
                    case "bind_mobile":
                      return <BindMobile popupType={item.get("type")}/>;
                    case "location":
                      return <Location popupType={item.get("type")}/>;
                    case "subtract":
                      return <Subtract popupType={item.get("type")}/>;
                    case "forgetpassword":
                      return <ForgetPassword popupType={item.get("type")}/>;
                    case "specialist":
                      return <Specialist popupType={item.get("type")}/>;
                    case "folder":
                      return <Folder popupType={item.get("type")}/>;
                    case "dynamicFile":
                      return <DynamicFile popupType={item.get("type")}/>;
                    case "appointment":
                      return <Appointment popupType={item.get("type")}/>;
                    case "modification":
                      return <Modification popupType={item.get("type")}/>;
                    case "publiCmake":
                      return <PubliCmake popupType={item.get("type")}/>;
                    case "setpassword":
                      return <Setpassword popupType={item.get("type")}/>;

                    default:
                      return null;
                  }
                })()}
              </div>
          ))}
        </Fragment>
    );
  }
}

const mapState = state => {
  return {
    showBox: state.getIn(["popup", "showBox"])
  };
};

const mapDispath = dispath => {
  return {
    //改变弹出框状态
    changePopupBox(info) {
      dispath(changePopupBox(info));
    }
  };
};

export default connect(mapState, mapDispath)(Index);
