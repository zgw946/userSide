import React, {Component, Fragment} from "react";
import "./index.css";
import {withRouter} from "react-router-dom";
import connect from "react-redux/lib/connect/connect";
import {changePopupBox} from "../../../components/layout/popup/actionCreators";
import {myRequest} from "../../../function";
import {Input, Button, message, Form, Icon, Modal} from "antd";

//首页
class Index extends Component {
  state = {
    disabledBtn: false, //是否使按钮失效
    leftTime: 120, //重置按钮剩余时间
    forgepassword: 1,
    keys: "" // key
  };

  render() {
    // const { userInfo } = this.props; //用户信息
    const {getFieldDecorator} = this.props.form;
    return (
        <Fragment>
          <Form onSubmit={this.handleSubmit} className="law_Form">
            {(() => {
              switch (this.state.forgepassword) {
                case 1:
                  return (
                      <Fragment>
                        <Form.Item hasFeedback>
                          {getFieldDecorator("mobile", {
                            rules: [
                              {required: true, message: "请输入手机号码"},
                              {
                                pattern: "^[1][3,4,5,7,8][0-9]{9}$",
                                message: "用户名必须为手机号码"
                              }
                            ]
                          })(
                              <Input
                                  prefix={
                                    <Icon type="user" style={{color: "#bfbfbf"}}/>
                                  }
                                  placeholder="请输入手机号码"
                              />
                          )}
                        </Form.Item>
                        <Form.Item>
                          {getFieldDecorator("code", {
                            rules: [
                              {required: true, message: "请输入验证码"},
                              {len: 6, message: "验证码长度必须为6"}
                            ]
                          })(
                              <Input
                                  style={{width: 198}}
                                  type="text"
                                  placeholder="请输入验证码"
                                  prefix={
                                    <Icon type="mobile" style={{color: "#bfbfbf"}}/>
                                  }
                              />
                          )}
                          {this.state.disabledBtn ? (
                              <Button
                                  disabled={true}
                                  style={{marginLeft: 8, width: "100px"}}
                              >
                                {this.state.leftTime}秒后获取
                              </Button>
                          ) : (
                              <Button
                                  onClick={() => this.sendCode()}
                                  style={{marginLeft: 10}}
                              >
                                获取验证码
                              </Button>
                          )}
                        </Form.Item>
                        <Button
                            onClick={() => this.btnNext()}
                            htmlType="submit"
                            style={{
                              width: "100%",
                              marginTop: 30,
                              backgroundColor: "#2e3341",
                              border: "#2e3341",
                              color: "#fff"
                            }}
                            type="primary"
                        >
                          下一步
                        </Button>
                      </Fragment>
                  );
                case 2:
                  return (
                      <Fragment>
                        <Form.Item
                            hasFeedback
                            extra="2-20位,仅支持汉字字母数字和下划线,不能有空格"
                            style={{
                              color: "#333",
                              fontSize: "12px",
                              margin: "0px 0px 0px 0px",
                              boxSizing: "content-box"
                            }}
                        >
                          {getFieldDecorator("password", {
                            rules: [
                              {required: true, message: "请输入新密码"},
                              {min: 8, message: "密码长度至少为8"},
                              {validator: this.validateToNextPassword}
                            ]
                          })(
                              <Input.Password
                                  placeholder="请输入新的密码"
                                  type="password"
                              />
                          )}
                        </Form.Item>
                        <Form.Item
                            hasFeedback
                            style={{
                              color: "#333",
                              fontSize: "16px",
                              margin: "11px 0px 15px 0px"
                            }}
                        >
                          {getFieldDecorator("confirm_password", {
                            rules: [
                              {required: true, message: "请再次输入密码"},
                              {min: 8, message: "密码长度至少为8"},
                              {validator: this.compareToFirstPassword}
                            ]
                          })(
                              <Input.Password
                                  placeholder="请再次输入密码"
                                  type="password"
                              />
                          )}
                        </Form.Item>
                        <Button
                            style={{
                              width: "100%",
                              marginTop: "30px",
                              backgroundColor: "#2e3341",
                              border: "#2e3341",
                              color: "#fff"
                            }}
                            type="primary"
                            htmlType="submit"
                        >
                          提交
                        </Button>
                      </Fragment>
                  );
                default:
                  return null;
              }
            })()}
          </Form>
        </Fragment>
    );
  }

  btnNext() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let that = this;
        myRequest({
          method: "post",
          path: "/common/auth/get_reset_password_key",
          data: {
            mobile: values.mobile,
            code: values.code,
            user_type: 1
          },
          callback: function (response) {
            if (response.data.code === 0) {
              that.setState({
                keys: response.data.data.key,
                forgepassword: 2
              });
            }
          }
        });
      }
    });
  }

  //发送验证码
  sendCode() {
    //验证账号
    this.props.form.validateFields(["mobile"], (err, values) => {
      let that = this;
      // 验证成功发送请求
      if (!err) {
        let form = this.props.form;
        myRequest({
          method: "post",
          path: "/common/message/send",
          data: {
            mobile: values.mobile,
            user_type: 1,
            code_type: 2
          },
          callback: function (response) {
            //处理返回结果
            if (response.data.code !== 0) {
              //错误提示
              form.setFields({
                code: {
                  errors: [new Error(response.data.msg)]
                }
              });
            } else {
              //关闭错误的提示
              form.setFields({
                code: {}
              });
              //改变按钮状态
              that.setState({
                disabledBtn: true
              });
              that.changeBtn(); //发送验证码改变按钮
              //测试环境直接弹窗显示验证码
              if (response.data.data) {
                Modal.success({
                  title: "验证码",
                  content: response.data.data.code
                });
              }
            }
          }
        });
      }
    });
  }

  //改变按钮状态
  changeBtn() {
    let that = this;
    //实时改变按钮状态
    let interval = setInterval(() => {
      let left = that.state.leftTime - 1;
      that.setState({
        leftTime: left
      });
      //如果间隔时间小于0，重置按钮
      if (this.state.leftTime <= 0) {
        //清楚定时器
        clearInterval(interval);
        this.setState({
          disabledBtn: false,
          leftTime: 120
        });
      }
    }, 1000);
  }

  //校验确认密码是否与密码一致
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("密码输入不一致");
    } else {
      callback();
    }
  };
  //改变密码后再次判断两次输入密码是否一致
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (
        form.getFieldValue("confirm_password") &&
        value !== form.getFieldValue("confirm_password")
    ) {
      form.validateFields(["confirm_password"], {force: true});
    } else {
      //关闭错误提示
      form.setFields({
        confirm_password: {
          value: form.getFieldValue("confirm_password")
        }
      });
    }
    callback();
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // let that = this;
        //提交请求
        myRequest({
          method: "post",
          path: "/common/auth/reset_password",
          data: {
            password: values.password,
            key: this.state.keys
          },
          callback: function (response) {
            //处理返回结果
            if (response.data.code === 0) {
              message.success("修改成功");
            } else {
              message.error(response.data.msg);
            }
          }
        });
      }
    });
  };
}

const mapState = state => {
  return {
    // userInfo: state.getIn(["header", "userInfo"]), //用户信息
    // session: state.getIn(["index", "session"]), //聊天会话信息
    // sessionFaq: state.getIn(["index", "sessionFaq"]) //机器人会话信息
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

//数据仓库
Index = connect(mapState, mapDispath)(Index);
//添加表单
Index = Form.create()(Index);
//添加路由
Index = withRouter(Index);

export default Index;
