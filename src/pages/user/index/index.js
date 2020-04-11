import React, { Component, Fragment } from "react";
import { Avatar, Form, Icon, Input, Radio, message, Button } from "antd";
import "./index.css";
import { changePopupBox } from "../../../components/layout/popup/actionCreators";
import connect from "react-redux/es/connect/connect";
import { myRequest } from "../../../function";
import { getUserInfo } from "../../../components/layout/header/actionCreators";

class Index extends Component {
	state = {
		name: "", //用户名
		value: 1,
		editName: false //是否为编辑名称状态
	};

	//改变名称编辑状态
	changeEditNameStatus() {
		this.setState(
			{
				editName: !this.state.editName
			},
			() => {
				this.rename.focus();
			}
		);
	}
	// 微信
	info() {
		message.info("此功能尚未开发");
	}
	//更新用户信息
	updateUserInfo(e, column) {
		let data = {},
			that = this;
		const value = e.target.value;
		//判断修改的是哪个字段
		switch (column) {
			case "name":
				data.name = value;
				break;
			case "sex":
				data.sex = value;
				break;
			default:
				return false;
		}
		myRequest({
			method: "put",
			path: "/consultant/user/index",
			auth: true,
			data,
			callback: function(response) {
				//处理返回结果
				if (response.data.code !== 0) {
					message.error(response.data.msg);
				} else {
					//更新用户信息
					that.props.getUserInfo();

					if (column === "name") {
						that.setState({
							editName: false
						});
					}
				}
			}
		});
	}
	render() {
		const { userInfo } = this.props; //用户信息
		const { getFieldDecorator } = this.props.form;
		if (userInfo) {
			return (
				<Fragment>
					{/* 右边部分 */}
					<div className="rights">
						{/* <!-- 我的信息 --> */}
						<div className="user_message">
							<p className="p_user_message">我的信息</p>
						</div>
						{/* <!-- 账号 头像 --> */}
						<div className="account">
							<div className="div_tou">
								<Avatar size={40} icon="user" src={userInfo.head_img} />
							</div>
							<p className="p_account">账号信息:</p>
							<Button
								style={{ backgroundColor: "#292d39", color: "#fff" }}
								onClick={() =>
									this.props.changePopupBox([{ type: "change_avatar" }])
								}
								className="bt_primary"
							>
								编辑头像
							</Button>
						</div>
						{/* <!-- 名称 --> */}
						<div className="user_names">
							<span className="span_name">昵称:</span>
							{this.state.editName ? (
								getFieldDecorator("name", {
									initialValue: userInfo.name
								})(
									<Input
										ref={refs => (this.rename = refs)}
										className="w200"
										placeholder="请输入您的名称"
										onBlur={e => this.updateUserInfo(e, "name")}
									/>
								)
							) : (
								<span className="name_ding">{userInfo.name}</span>
							)}
							<Button
								style={{ backgroundColor: "#292d39", color: "#fff" }}
								onClick={() => this.changeEditNameStatus()}
								className="bt_users"
							>
								编辑
							</Button>
						</div>
						{/* <!-- 性别 --> */}
						<div className="user_names">
							<span className="span_name">
								性别:
								{getFieldDecorator("sex", {
									initialValue: userInfo.user.sex
								})(
									<Radio.Group
										onChange={value => this.updateUserInfo(value, "sex")}
									>
										<Radio value={1} style={{ marginLeft: 77 }}>
											男
										</Radio>
										<Radio value={2}>女</Radio>
										<Radio value={0}>保密</Radio>
									</Radio.Group>
								)}
							</span>
							<span className="name_dings"></span>
						</div>
						{/* <!-- 手机 --> */}
						<div className="user_names">
							<span className="span_name">手机:</span>
							<span className="name_ding">
								{userInfo.user.mobile ? userInfo.user.mobile : "未设置"}
							</span>
							{userInfo.user.mobile === userInfo.user.mobile ? (
								<Button
									style={{ backgroundColor: "#292d39", color: "#fff" }}
									onClick={() =>
										this.props.changePopupBox([{ type: "subtract" }])
									}
									className="bt_users"
								>
									解除绑定
								</Button>
							) : (
								<Button
									style={{ backgroundColor: "#292d39", color: "#fff" }}
									onClick={() =>
										this.props.changePopupBox([{ type: "bind_mobile" }])
									}
									className="bt_users"
								>
									立即绑定
								</Button>
							)}
						</div>
						{/* <!-- 密码 --> */}
						<div className="user_names">
							<span className="span_name">密码:</span>
							<span className="name_ding">
								{userInfo.user.password_set ? "已设置" : "未设置"}
							</span>
							{userInfo.user.password_set ? (
								<Button
									style={{ backgroundColor: "#292d39", color: "#fff" }}
									onClick={() =>
										this.props.changePopupBox([{ type: "update_password" }])
									}
									className="bt_users"
								>
									修改
								</Button>
							) : (
								<Button
									style={{ backgroundColor: "#292d39", color: "#fff" }}
									onClick={() =>
										this.props.changePopupBox([{ type: "setpassword" }])
									}
									className="bt_users"
								>
									立即设置
								</Button>
							)}
						</div>
						{/* <!-- 第三方账号 --> */}
						<div className="user_names">
							<span className="span_name" style={{ color: "#6b76ff" }}>
								第三方账号绑定:
							</span>
						</div>
						{/* <!-- 微信 --> */}
						<div className="user_names">
							<span className="san_name">
								<Icon
									type="wechat"
									theme="filled"
									style={{ marginRight: 6, color: "#09ca09" }}
								/>
								微信
							</span>
							<span className="uers_span">未绑定</span>
							<Button
								onClick={() => this.info()}
								style={{ backgroundColor: "#292d39", color: "#fff" }}
								className="btn btn-default bt_userss"
							>
								绑定
							</Button>
						</div>
					</div>
				</Fragment>
			);
		} else {
			return null;
		}
	}
	componentDidUpdate() {
		// //关闭弹窗后重新获取用户列表信息
		// console.log('====================================');
		// console.log(this.props.showBox);
		// console.log('====================================');
		// if (props.showBox !== this.props.showBox) {
		// 	// 更新用户信息
		// 	this.props.getUserInfo();
			
		// }
		this.props.getUserInfo();
	}
}

const mapState = state => {
	return {
		userInfo: state.getIn(["header", "userInfo"]), //用户信息
		showBox: state.getIn(["popup", "showBox"])
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

Index = connect(mapState, mapDispath)(Index);
Index = Form.create()(Index);

export default Index;
