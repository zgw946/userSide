import React, { Component, Fragment } from "react";
import "./index.css";
import { Link, withRouter } from "react-router-dom";
import connect from "react-redux/lib/connect/connect";
import { changePopupBox } from "../../components/layout/popup/actionCreators";
import LoginPasswords from "./password";
import LawSquare from "./lawSquare";
import Mymessage from "./myMessage";
import Introduce from "./introduce";

import {
	Input,
	Button,
	Tabs,
	Icon,
	message,
	Checkbox,
	Form,
	Row,
	Col,
	Avatar,
	Divider
} from "antd";

const { TabPane } = Tabs;

//首页
class Index extends Component {
	state = {
		list: [
			{
				id: 1,
				content: "1.问些神奇的问题"
			},
			{
				id: 2,
				content: "2.法律顾问冲到我面前"
			},
			{
				id: 3,
				content: "3.给法律顾问打钱"
			}
		],
		type: "password", //登录方式(登录方式有'password'、'code')
		disabledBtn: false, //是否使按钮失效
		leftTime: 120, //重置按钮剩余时间
		loginLoading: false, //登录按钮是否为加载状态
		switchover: true, //登录切管
		passwords: 1
	};

	//选择登录方式
	selectLoginType(type) {
		this.setState({
			type
		});
	}

	// 忘记密码
	handClick() {
		this.setState({
			passwords: 2
		});
	}

	render() {
		// const { userInfo } = this.props; //用户信息
		const { getFieldDecorator } = this.props.form;
		return (
			<Fragment>
				<div className="user_index">
					<div className="home_index">
						{/* 法律咨询 */}
						<div className="law_consult">
							{/* 头部 */}
							<div className="nav_consult">
								<span style={{ color: "#6B76FF", float: "left" }}>
									法律咨询
								</span>
								<Link to="/advisory">
									<span style={{ color: "#B3B3B3", float: "right" }}>
										立即咨询
									</span>
								</Link>
							</div>
							{/* 内容部分 */}
							<div className="consult_content">
								<p style={{ margin: "0px 0px 0px 25px", color: "#333" }}>
									你好,请问我能为您做什么？
								</p>
								{this.state.list.map(item => (
									<Button
										key={item.id}
										size="small"
										className="law_btnContent"
										style={{ backgroundColor: "#2e3341" }}
									>
										{item.content}
									</Button>
								))}
							</div>
							<div className="law_chat">
								<span>我有问题想咨询</span>
							</div>
						</div>
						{/* 登录 */}
						<div className="law_login">
							{this.state.switchover ? (
								<Form onSubmit={this.handleSubmit}>
									{(() => {
										switch (this.state.passwords) {
											case 1:
												return (
													<Fragment>
														<Tabs
															defaultActiveKey="password"
															forceRender
															onChange={activeKey =>
																this.selectLoginType(activeKey)
															}
														>
															<TabPane tab="密码登录" key="password" />
															<TabPane tab="短信登录" key="code" />
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
															})(
																<Input
																	type="text"
																	placeholder="请输入手机号码"
																/>
															)}
														</Form.Item>
														{this.state.type === "code" ? (
															<Form.Item>
																<Row gutter={8}>
																	<Col span={17}>
																		{getFieldDecorator("code", {
																			rules: [
																				{
																					required: true,
																					message: "请输入验证码"
																				},
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
																				style={{
																					width: "100%",
																					fontSize: "12px"
																				}}
																				disabled={true}
																			>
																				{this.state.leftTime}秒可获取
																			</Button>
																		) : (
																			<Button
																				className="get-captcha"
																				style={{
																					width: "100%",
																					fontSize: "12px"
																				}}
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
																})(
																	<Input
																		type="password"
																		placeholder="请输入密码"
																	/>
																)}
															</Form.Item>
														)}
														<Button
															loading={this.state.loginLoading}
															htmlType="submit"
															style={{
																width: "100%",
																backgroundColor: "#2e3341",
																border: "#2e3341",
																color: "#fff"
															}}
														>
															{this.state.type === "code"
																? "登录/注册"
																: "登录"}
														</Button>
														<div style={{ float: "left", marginTop: "5px" }}>
															<Checkbox>下次自动登录</Checkbox>
														</div>
														<div className="h30" style={{ float: "right" }}>
															<span
																className="rf mt5 c-ccc"
																onClick={() => this.handClick()}
															>
																忘记密码
															</span>
														</div>
														<div style={{ clear: "both" }}></div>
														<div className="law_login_btn">
															<span className="law_hx_xian"></span>
															<span className="dsf">第三方登录</span>
															<span className="law_hx_xian2"></span>
														</div>
														<div>
															<Icon
																onClick={() => {
																	message.info("暂未开放");
																}}
																className="law_wx"
																type="wechat"
															/>
														</div>
													</Fragment>
												);
											case 2:
												return <LoginPasswords />;
											default:
												break;
										}
									})()}
								</Form>
							) : (
								<div>
									{/* 头像 */}
									<div className="law_Avatar">
										<Avatar shape="square" size={64} icon="user" />
									</div>
									{/* 用户名，地区 */}
									<div className="law_user_area">
										<span style={{ fontSize: "16px", color: "#333" }}>
											用户名
										</span>
										<br />
										<span style={{ fontSize: "14px", color: "#666" }}>
											广东深圳
										</span>
									</div>
									{/* 性别，法龄，帖子 */}
									<div className="law_sixTime">
										{/* 左 */}
										<div className="law_leftSix">
											<span style={{ color: "#999" }}>性别</span>
											<br />
											<span style={{ color: "#333" }}>男</span>
										</div>
										<Divider
											type="vertical"
											style={{ float: "left" }}
											className="law_Divider"
										/>
										{/* 中 */}
										<div className="law_contentTime">
											<span style={{ color: "#999" }}>法龄</span>
											<br />
											<span style={{ color: "#333" }}>1天</span>
										</div>
										<Divider
											type="vertical"
											style={{ float: "left" }}
											className="law_Divider"
										/>
										{/* 右 */}
										<div className="law_rightPost">
											<span style={{ color: "#999" }}>帖子</span>
											<br />
											<span style={{ color: "#333" }}>20</span>
										</div>
									</div>
									<div style={{ clear: "both" }}></div>
									{/* 前往用户中心 */}
									<div style={{ marginTop: "41px" }}>
										<Divider className="law_Divider_user" />
										<Link to="/user/index">
											<p style={{ textAlign: "center", color: "#999" }}>
												前往用户中心
												<Icon type="right" />
											</p>
										</Link>
									</div>
								</div>
							)}
						</div>
						{/* 法律广场 */}
						<div className="law_square">
							<LawSquare />
						</div>
						{/* 消息，介绍 */}
						<div className="law_synthesize">
							{/* 消息 */}
							<div className="law_message">
								<Mymessage />
							</div>
							{/* 介绍 */}
							<div className="law_introduce">
								<Introduce />
							</div>
						</div>
					</div>
					<div style={{ clear: "both" }}></div>
				</div>
			</Fragment>
		);
	}
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
