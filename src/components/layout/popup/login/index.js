import React, { PureComponent } from "react";
import "./index.css";
import { changePopupBox } from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import {
	Input,
	Button,
	Tabs,
	Icon,
	message,
	Modal,
	Form,
	Row,
	Col
} from "antd";
import { getUserInfo } from "../../header/actionCreators";
import { myRequest, setLocalStorage } from "../../../../function";
import { withRouter } from "react-router-dom";
import store from "../../../../store";

const { TabPane } = Tabs;

class Index extends PureComponent {
	state = {
		type: "code", //登录方式(登录方式有'password'、'code')
		disabledBtn: false, //是否使按钮失效
		leftTime: 120, //重置按钮剩余时间
		loginLoading: false //登录按钮是否为加载状态
	};

	//选择登录方式
	selectLoginType(type) {
		this.setState({
			type
		});
	}

	//发送验证码
	sendCode() {
		//验证账号
		this.props.form.validateFields(["mobile"], (err, values) => {
			let that = this; //赋值父类
			//验证成功发送请求
			if (!err) {
				let form = this.props.form;
				myRequest({
					method: "post",
					path: "/common/message/send",
					data: {
						mobile: values.mobile,
						user_type: 1,
						code_type: 1
					},
					callback: function(response) {
						//处理返回结果
						if (response.data.code !== 0) {
							//错误提示
							form.setFields({
								code: {
									errors: [new Error(response.data.msg)]
								}
							});
						} else {
							//关闭错误提示
							form.setFields({
								code: {}
							});

							//改变按钮状态
							that.setState(
								{
									disabledBtn: true
								},
								() => {
									//实时改变按钮状态
									let interval = setInterval(() => {
										let left = that.state.leftTime - 1;

										that.setState({
											leftTime: left
										});

										//如果间隔时间小于0，重置按钮
										if (that.state.leftTime <= 0) {
											//清楚定时器
											clearInterval(interval);

											that.setState({
												disabledBtn: false,
												leftTime: 120
											});
										}
									}, 1000);
								}
							);

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

	//登录/注册
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let that = this;
				//改变提交按钮状态
				that.setState({
					loginLoading: true
				});
				let path = "",
					data = {
						mobile: values.mobile,
						user_type: 1
					};
				//根据不同的登录类型作出相应的操作
				if (that.state.type === "code") {
					//验证码登录或注册
					//设置接口路径
					path = "/common/auth/code_login_or_register";

					//设置参数
					data.code = values.code;
				} else {
					//密码登录
					path = "/common/auth/login";
					data.password = values.password;
				}
				//提交请求
				myRequest({
					method: "post",
					path,
					data,
					callback: function(response) {
						//改变提交按钮状态
						that.setState({
							loginLoading: false
						});
						//处理返回结果
						if (response.data.code !== 0) {
							message.error(response.data.msg, 2);
						} else {
							//储存认证令牌
							setLocalStorage("api_token", response.data.data.token);

							//设置用户信息
							that.props.getUserInfo();

							//检测用户信息的改变
							let subscribeUserInfo = store.subscribe(() => {
								if (that.props.userInfo) {
									let jumpLink = that.props.jumpLink; //登录后需要跳转的页面

									//跳转到需要跳转的页面
									if (jumpLink) {
										that.props.history.push(jumpLink);
									}

									subscribeUserInfo(); //取消订阅

									//关闭登录框
									that.props.changePopupBox([{ type: "login" }]);
								}
							});

							message.success("登录成功");
						}
					}
				});
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal
				width={450}
				style={{ marginTop: 60 }}
				bodyStyle={{ padding: 24 }}
				destroyOnClose={true}
				footer={null}
				onCancel={() =>
					this.props.changePopupBox([{ type: this.props.popupType }])
				}
				visible={true}
			>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Tabs
						defaultActiveKey="code"
						forceRender
						onChange={activeKey => this.selectLoginType(activeKey)}
					>
						<TabPane tab="短信登录/注册" key="code" />
						<TabPane tab="密码登录" key="password" />
					</Tabs>
					<Form.Item hasFeedback>
						{getFieldDecorator("mobile", {
							rules: [
								{ required: true, message: "请输入手机号码" },
								{
									pattern: "^[1][3,4,5,7,8][0-9]{9}$",
									message: "用户名必须为手机号码"
								}
							]
						})(<Input type="text" placeholder="请输入手机号码" />)}
					</Form.Item>
					{this.state.type === "code" ? (
						<Form.Item>
							<Row gutter={8}>
								<Col span={17}>
									{getFieldDecorator("code", {
										rules: [
											{ required: true, message: "请输入验证码" },
											{ len: 6, message: "验证码长度必须为6" }
										]
									})(
										<Input
											prefix={
												<Icon
													type="mobile"
													style={{ color: "rgba(0,0,0,.25)" }}
												/>
											}
											placeholder="短信验证码"
										/>
									)}
								</Col>
								<Col span={7}>
									{this.state.disabledBtn ? (
										<Button
											className="get-captcha"
											style={{ width: "100%" }}
											disabled={true}
										>
											{this.state.leftTime}秒后可获取
										</Button>
									) : (
										<Button
											className="get-captcha"
											style={{ width: "100%" }}
											onClick={() => this.sendCode()}
										>
											获取验证码
										</Button>
									)}
								</Col>
							</Row>
						</Form.Item>
					) : (
						<Form.Item hasFeedback>
							{getFieldDecorator("password", {
								rules: [
									{ required: true, message: "请输入密码" },
									{ min: 8, message: "密码长度必须大于8" }
								]
							})(<Input type="password" placeholder="请输入密码" />)}
						</Form.Item>
					)}
					<Button
						loading={this.state.loginLoading}
						htmlType="submit"
						style={{ width: "100%" }}
						type="primary"
					>
						{this.state.type === "code" ? "登录/注册" : "登录"}
					</Button>
				</Form>
				<div className="h30">
					<a
						className="rf mt5 c-ccc"
						onClick={() =>
							this.props.changePopupBox([{ type: "forgetpassword" }])
						}
					>
						忘记密码
					</a>
				</div>
				<div className="login_lu">
					<span className="hx_xian"></span>
					<span className="dsf">第三方登录</span>
					<span className="hxs_xian"></span>
				</div>
				<div className="yuandian">
					<Icon
						onClick={() => {
							message.info("暂未开放");
						}}
						className="iconev_wx"
						type="wechat"
					/>
				</div>
			</Modal>
		);
	}
}

const mapState = state => {
	return {
		userInfo: state.getIn(["header", "userInfo"])
	};
};

const mapDispath = dispath => {
	return {
		//改变弹出框状态
		changePopupBox(info) {
			dispath(changePopupBox(info));
		},
		//设置用户信息
		getUserInfo() {
			dispath(getUserInfo());
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
