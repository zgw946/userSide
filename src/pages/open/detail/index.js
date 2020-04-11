import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import "./index.css";
import { Button, Icon, Avatar, Input, message, Form, Tag } from "antd";
import { myRequest } from "../../../function";
import { getUserInfo } from "../../../components/layout/header/actionCreators";
import moment from "moment";
class Index extends Component {
	state = {
		List: [], // 我的咨询回复
		name: "", // 名字
		region: "", // 地区
		comment_num: "", // 评论数
		like_num: "", // 喜欢数
		content: "", // 内容
		time: "", // 时间
		type: "", // 类型
		consultantId: 0 //咨询者ID
	};

	// 用户关注点赞收藏列表
	detailList() {
		let that = this;
		myRequest({
			method: "get",
			path: "/common/consultant/open/1",
			callback: function(response) {
				//处理返回结果
				console.log(response);
				if (response.data.code === 0) {
					that.setState({
						name: response.data.data.consultant.name,
						region: response.data.data.area.name,
						content: response.data.data.content,
						comment_num: response.data.data.comment_num,
						like_num: response.data.data.like_num,
						time: response.data.data.created,
						type: response.data.data.type.parent.name,
						consultantId: response.data.data.consultant.id
					});
				}
			}
		});
	}

	// 点赞收藏
	putBtnclick() {
		// let that = this;
		myRequest({
			method: "put",
			path: "/consultant/open/index/1/collect",
			auth: true,
			callback: function(response) {
				if (response.data.code === 0) {
					message.success(response.data.msg);
				} else {
					message.error(response.data.msg);
				}
			}
		});
	}

	// 点赞收藏
	putBtnlink() {
		// let that = this;
		myRequest({
			method: "put",
			path: "/consultant/open/index/1/like",
			auth: true,
			callback: function(response) {
				if (response.data.code === 0) {
					message.success(response.data.msg);
				} else {
					message.error(response.data.msg);
				}
			}
		});
	}

	//
	replyClick() {
		// let that = this;
		myRequest({
			method: "put",
			path: "/consultant/open/reply/1/like",
			auth: true,
			callback: function(response) {
				if (response.data.code === 0) {
					message.success(response.data.msg);
				} else {
					message.error("点赞失败");
				}
			}
		});
	}

	// 追问追打的回复
	askClick() {
		// let that = this;
		myRequest({
			method: "post",
			path: "/consultant/open/reply/1/ask",
			auth: true,
			data: {
				// content: ""
			}
		});
	}

	// 用户律师回复对话
	getUserList() {
		let that = this;
		myRequest({
			method: "get",
			path: "/common/consultant/open/1/reply",
			callback: function(response) {
				if (response.data.code === 0) {
					that.setState({
						List: response.data.data,
						list2: response.data.data
					});
				}
			}
		});
	}

	handleSubmit = e => {
		// let that = this;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				myRequest({
					method: "post",
					path: "/consultant/open/reply/1/ask",
					auth: true,
					data: {
						content: values.content
					},
					callback: function(response) {
						console.log(response);
						if (response.data.code === 0) {
							message.success(response.data.msg);
						} else {
							message.error(response.data.msg); // 错误信息
						}
					}
				});
			}
		});
	};

	componentDidMount() {
		this.detailList(); // 用户关注点赞收藏列表
		this.getUserList(); // 用户律师回复对话
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { userInfo } = this.props; //用户信息
		return (
			<Fragment>
				<div
					style={{
						backgroundColor: "#f5f5f5",
						width: "100%",
						overflow: "auto"
					}}
				>
					<div className="headerdiscuss">
						<div className="header_open">
							<div style={{ padding: "25px 0px 0px 20px " }}>
								<span>类型：</span>
								<span>{this.state.type}</span>
							</div>

							<span className="discuss_ls">浏览数</span>
							<br></br>
							<Button
								onClick={() => this.putBtnclick()}
								size="small"
								type="primary"
								className="discuss_bts"
								ghost
							>
								<Icon type="like" />
								{this.state.like_num}
							</Button>
							<Icon
								type="message"
								className="discuss_icos"
								theme="filled"
							></Icon>
							<span className="discuss_pl">{this.state.comment_num}条回复</span>
							<span className="discuss_num">{this.state.like_num}</span>
						</div>
					</div>
					{/* 用户 */}
					<div className="discuss_user">
						{/* 头像 */}
						<div style={{ float: "left" }}>
							<Avatar
								src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								className="Avatars"
							/>
						</div>
						{/* 用户信息详细 */}
						<div style={{ float: "left" }}>
							<span className="discuss_yhs">{this.state.name}</span>
							<Icon
								type="environment"
								className="disccuss_dw"
								style={{ fontSize: "12px" }}
							/>
							<span className="discuss_gsz">{this.state.region}</span>
						</div>
						{/* 内容部分 */}
						<div>
							<p className="P_wenzi">{this.state.content}</p>
						</div>
					</div>
					<div style={{ clear: "both" }}></div>
					<div className="discuss_users">
						{/* 第一条评论 */}
						{this.state.List.map(item => (
							<div className="userbtntwos" key={item.id}>
								{/* 头像 */}
								<div style={{ float: "left" }}>
									<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
								</div>
								{/* 用户名称 */}
								<div style={{ float: "left" }}>
									<h2 style={{ marginLeft: "10px", marginBottom: "0px" }}>
										{item.lawyer.name}
									</h2>
									<Icon
										type="environment"
										style={{
											fontSize: "12px",
											marginLeft: "9px",
											color: "#ccc"
										}}
									/>
									<span
										style={{
											fontSize: "12px",
											marginLeft: "9px",
											color: "#ccc"
										}}
									>
										{item.lawyer.city.name}
									</span>
								</div>
								{/* 咨询按钮 */}
								<div style={{ float: "left" }}>
									<Button
										size="small"
										type="primary"
										style={{ marginLeft: "15px", marginTop: "12px" }}
									>
										咨询
									</Button>
								</div>
								<div style={{ clear: "both" }}></div>
								{/* 内容部分 */}
								<div>
									<p className="P_wenzi2">{item.content}</p>
									<p style={{ marginLeft: "38px", color: "#ccc" }}>
										{/* 今天&nbsp;14:20 */}
										{moment().diff(moment(item.created), "day") > 7
											? moment(item.created).format("YYYY/MM/DD HH:mm")
											: moment(item.created).fromNow()}
									</p>
								</div>
								<div style={{ clear: "both" }}></div>
								{/* 查看主评论 */}
								<div className="view_detailed">
									{item.reply_append.map(itemChild => (
										<div className="userbtn_name" key={itemChild.id}>
											{/* 头像 */}
											<div style={{ float: "left" }}>
												<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
											</div>
											{/* 时间 */}
											<span style={{ float: "right", color: "#ccc" }}>
												{itemChild.created}
											</span>
											<Tag
												color={itemChild.type === 1 ? "orange" : "green"}
												style={{ marginLeft: "-45px" }}
											>
												{itemChild.type === 1 ? "咨询者" : "律师"}
											</Tag>

											<div style={{ float: "left", marginBottom: "7px" }}>
												<h2
													style={{
														marginLeft: "10px",
														marginBottom: "0px"
													}}
												>
													{itemChild.type_plan}
												</h2>

												<p style={{ marginLeft: "9px", marginTop: "10px" }}>
													{itemChild.content}
												</p>
											</div>
											<div style={{ clear: "both" }}></div>
										</div>
									))}
									{userInfo ? (
										<div style={{ marginTop: "15px", marginLeft: "39px" }}>
											<Form onSubmit={this.handleSubmit}>
												<Form.Item hasFeedback style={{ float: "left" }}>
													{getFieldDecorator("content", {
														rules: [
															{
																required: true,
																message: "请描述您的内容"
															}
														]
													})(
														<Input.TextArea
															style={{ resize: "none", width: "870px" }}
															rows={2}
															placeholder="请输入回复内容"
														/>
													)}
												</Form.Item>
												<Form.Item style={{ float: "left" }}>
													<Button
														htmlType="submit"
														type="primary"
														style={{ marginLeft: "15px" }}
														onClick={() => this.askClick()}
													>
														发布
													</Button>
												</Form.Item>
											</Form>
											<div style={{ clear: "both" }}></div>
										</div>
									) : (
										<div></div>
									)}
								</div>
							</div>
						))}
						<div style={{ clear: "both" }}></div>
					</div>
				</div>
				<div style={{ clear: "both" }}></div>
			</Fragment>
		);
	}
}

const mapState = state => {
	return {
		userInfo: state.getIn(["header", "userInfo"]) //用户信息
	};
};
const mapDispath = dispath => {
	return {
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

export default Index;
