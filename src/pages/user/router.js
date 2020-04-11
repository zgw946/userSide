import React, { Component, Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "../../components/common/loading";
import { Avatar, Icon } from "antd";
import "./router.css";
import { Link } from "react-router-dom";
import connect from "react-redux/lib/connect/connect";

//引入组件
const Index = Loadable({
	loader: () => import("./index"),
	loading: Loading
}); //用户中心首页
const Collect = Loadable({
	loader: () => import("./collect"),
	loading: Loading
}); //我的收藏
class UserRouter extends Component {
	render() {
		const { userInfo } = this.props; //用户信息

		return (
			<Fragment>
				<div className="homes">
					{/* <!-- 大容器 --> */}
					<div className="da_rongqi">
						{/* <!-- 左边部分 --> */}
						<div className="lefts">
							{/* <!-- 头部 用户名 --> */}
							{userInfo ? (
								<div className="top_users">
									{/* <!-- 头像 --> */}
									<div className="p_users">
										<div className="div_tous">
											<Avatar size={40} icon="user" src={userInfo.head_img} />
										</div>
									</div>
									<p className="p-users">{userInfo.name}</p>
									<span className="sexs">
										性别
										<i className="bodys"></i>
									</span>
									<span className="sexs">
										法龄<i className="body2"></i>
									</span>
									<span className="sexs">帖子</span>
									<Icon
										type={
											userInfo.user.sex
												? userInfo.user.sex === 1
													? "man"
													: "woman"
												: "line"
										}
										className="glyhicons_bts"
										style={{ color: "#fff" }}
									/>

									<span style={{ float: "left" }} className="yitain">
										{userInfo.law_age}天
									</span>
									<span style={{ float: "right" }} className="skys">
										{userInfo.consult_num}
									</span>
								</div>
							) : null}
							{/* <!-- 用户中心 --> */}
							<div className="div_users">
								<span className="userswire"></span>
								<p className="centres">
									<i className="i_centres"></i>用户中心
								</p>
								<span className="userswires"></span>
							</div>
							{/* <!-- 消息关注 --> */}
							<div className="attentions">
								<Link to="/user/index">
									<p className="p_attention">我的信息</p>
								</Link>
								<Link to="/user/collect">
									<p className="p_attention">我的收藏</p>
								</Link>
							</div>
						</div>
						{/* <!-- 右边我的信息部分 --> */}
						<Switch>
							<Route exact path="/user/index" component={Index} />
							<Route path="/user/collect" component={Collect} />
							<Redirect exact from="/user" to="/user/index" />
						</Switch>
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapState = state => {
	return {
		userInfo: state.getIn(["header", "userInfo"]) //用户信息
	};
};

UserRouter = connect(mapState)(UserRouter);

export default UserRouter;
