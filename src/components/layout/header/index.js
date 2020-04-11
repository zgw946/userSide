import React, { Component, Fragment } from "react";
// 引入路由
import { Link, withRouter } from "react-router-dom";
import "./index.css";
// antd
import { Menu, Icon, Avatar, Dropdown, Modal, message, Spin } from "antd";
import { changePopupBox } from "../popup/actionCreators";
import { changeLocation, changemyLocation } from "../header/actionCreators";
import connect from "react-redux/lib/connect/connect";
import {
	clearToken,
	myRequest,
	getLocalStorage,
	setLocalStorage
} from "../../../function";

class Index extends Component {
	state = {
		nav: ["index"], //选中的菜单
		loginStatus: false //登录状态
	};

	//切换选中菜单
	handleClick = e => {
		this.setState({
			nav: e.key
		});
	};

	//初始化组件
	componentDidMount() {
		//获取被选中的菜单
		const pathname = this.props.location.pathname;
		let patharr = pathname.split("/");
		let nav = patharr[1] ? [patharr[1]] : ["index"];
		this.setState({
			nav
		});

		this.initArea();
	}

	//退出登录
	logout() {
		Modal.confirm({
			title: "登出",
			content: "确认登出系统吗？",
			cancelText: "取消",
			okText: "确定",
			onOk: () => {
				//提交请求
				myRequest({
					method: "delete",
					path: "/common/auth/logout",
					auth: true,
					callback: function(response) {
						//处理返回结果
						if (response.data.code !== 0) {
							message.error(response.data.msg, 2);
						} else {
							//清除用户信息
							clearToken();
						}
					}
				});
			}
		});
	}

	render() {
		const { userInfo } = this.props; //用户信息

		return (
			<Fragment>
				<div className="headers">
					<div className="header_container">
						<div className="headers_left">
							{/* login图片 */}
							<div className="logins_img">
								<Link to="/">
									<img
										width="100%"
										height="100%"
										src={require("../../../statics/images/web_logo2.png")}
										alt=""
									/>
								</Link>
							</div>
							{/* 边线 */}
							<div className="bianxian" />
							{/* 城市定位 */}
							<div className="citys">
								<i className="glyphicon glyphicon-map-marker icons_citys"></i>
								<span
									onClick={() =>
										this.props.changePopupBox([{ type: "location" }])
									}
									className="dingweiss"
								>
									{this.props.locations.city ? (
										<Fragment>{this.props.locations.city.name}</Fragment>
									) : (
										<Spin size="small" />
									)}
								</span>
							</div>
						</div>
						{/* 导航 咨询，介绍，法律广场 */}
						<div className="headers_center">
							<Menu
								style={{
									backgroundColor: "#292d39",
									borderBottom: 0,
									color: "#fff",
									margin: "0 auto",
									width: 300
								}}
								onClick={this.handleClick}
								selectedKeys={this.state.nav}
								mode="horizontal"
							>
								<Menu.Item key="index">
									<Link to="/" style={{ color: "#fff" }}>
										首页
									</Link>
								</Menu.Item>
								<Menu.Item key="consult">
									<Link to="/consult" style={{ color: "#fff" }}>
										咨询
									</Link>
								</Menu.Item>
								<Menu.Item key="introduce">
									<Link to="/introduce" style={{ color: "#fff" }}>
										介绍
									</Link>
								</Menu.Item>
								<Menu.Item key="open">
									<Link to="/open" style={{ color: "#fff" }}>
										法律广场
									</Link>
								</Menu.Item>
							</Menu>
						</div>
						<div className="headers_right">
							{userInfo ? (
								<div className="rf">
									{/* 日程安排 */}
									<Icon
										onClick={() =>
											this.props.changePopupBox([{ type: "schedule" }])
										}
										type="calendar"
										className=" tiems"
										style={{ color: "#fff" }}
									/>
									{/* 用户中心 */}
									<Dropdown
										overlay={
											<Menu>
												<Menu.Item>{userInfo.name}</Menu.Item>
												<Menu.Item>
													<Link to="/user/index">用户中心</Link>
												</Menu.Item>
												<Menu.Item onClick={() => this.logout()}>
													退出账号
												</Menu.Item>
											</Menu>
										}
										placement="bottomLeft"
									>
										<Avatar size={30} icon="user" style={{ marginTop: 2 }} src={userInfo.head_img}/>
									</Dropdown>
								</div>
							) : (
								<div className="rf">
									<a
										onClick={() =>
											this.props.changePopupBox([{ type: "login" }])
										}
										className=" btn_click"
									>
										登录/注册
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	//初始化选择的地区
	initArea() {
		let location = getLocalStorage("location"); // 存储
		//查看缓存是否存在地区信息
		if (location) {
			this.props.changeLocation(location);
		} else {
			//通过IP查询当前地区
			let that = this;
			myRequest({
				method: "get",
				path: "/common/location/auto_location_from_ip",
				auth: true,
				callback: function(response) {
					//处理返回结果
					if (response.data.code === 0) {
						let location = response.data.data
						//储存当前位置到本地
						setLocalStorage("mylocation", location);
						//改变当前位置
						that.props.changemyLocation(location);
						//储存当前位置到本地
						setLocalStorage("location", location);
						//改变当前位置
						that.props.changeLocation(location);
					
					}
				}
			});
		}
	}
}

const mapState = state => {
	return {
		userInfo: state.getIn(["header", "userInfo"]), //用户信息
		locations: state.getIn(["header", "location"]), //当前位置
		myLocation: state.getIn(["header", "mylocation"]) //我的位置
	};
};
const mapDispath = dispath => {
	return {
		//改变弹出框状态
		changePopupBox(info) {
			dispath(changePopupBox(info));
		},
		//修改当前位置
		changeLocation(value) {
			dispath(changeLocation(value));
		},
		//我的位置
		changemyLocation(value) {
			dispath(changemyLocation(value));
		}
	};
};

Index = withRouter(Index);
Index = connect(mapState, mapDispath)(Index);

export default Index;
