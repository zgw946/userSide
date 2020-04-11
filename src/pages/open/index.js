import React, { Component, Fragment } from "react";
import "./index.css";
import {
	Button,
	Icon,
	Input,
	Menu,
	Dropdown,
	Row,
	Col,

	Avatar,
	Tabs,
	message
} from "antd";
import { changePopupBox } from "../../components/layout/popup/actionCreators";
import connect from "react-redux/es/connect/connect";
import { Link } from "react-router-dom";
import { myRequest } from "../../function";

// import moment from "moment";

class Index extends Component {
	state = {
		list: [], //公开咨询列表
		total: 0, //总数据条数
		pageNum: 10, //每页显示条数
		page: 1, //当前页
		consult: [], // 我咨询列表
		typeList: [], // 我的类型选择列表
		region: [] // 选择地区
	};

	handleChange = () => {
		this.setState({
			dataSource: []
		});
	};

	//获取公开咨询列表
	getList() {
		const that = this,
			params = {};
		params.page_size = that.state.pageNum;
		params.page = that.state.page;
		myRequest({
			method: "get",
			path: "/common/consultant/open",
			auth: true,
			params,
			callback: function(response) {
				//处理返回结果
				if (response.data.code === 0) {
					that.setState({
						list: response.data.data.list,
						page: parseInt(response.data.data.page, 10),
						pageNum: parseInt(response.data.data.page_size, 10),
						total: parseInt(response.data.data.total_count, 10)
					});
				} else {
					message.error(response.data.msg);
				}
			}
		});
	}

	// 获取我的咨询列表
	getConsult() {
		let that = this;
		myRequest({
			method: "get",
			path: "/common/consultant/open/1/reply",
			callback: function(response) {
				// console.log(response);
				if (response.data.code === 0) {
					that.setState({
						consult: response.data.data
					});
				}
			}
		});
	}


	//初始化组件
	componentDidMount() {
		this.getList(); // 获取评论列表
		this.getConsult(); // 获取我的咨询列表
	}
	render() {
		return (
			<Fragment>
				<div>
					{/* <!-- 法律广场 --> */}
					<div className=" laws">
						<div className="law_guang">
							<div className="guangchang">
								<Row className="mt10 mb30">
									<Col span={18}>
										<Input.Search
											style={{ width: 600 }}
											onChange={this.handleChange}
											enterButton="搜索"
											placeholder="搜索相关条件"
										/>
									</Col>
									<Col span={3}>
										<Button
											onClick={() =>
												this.props.changePopupBox([{ type: "public_open" }])
											}
											type="primary"
											ghost
										>
											发布资讯
											<Icon type="sound" />
										</Button>
									</Col>
									<div span={3}>
										<Dropdown
											placement="bottomRight"
											style={{ width: 400 }}
											overlay={
												<Menu
													className="dd"
													style={{ width: 300, wordWrap: "break-word" }}
												>
													{this.state.consult.map(item => (
														<Menu.Item key={item.id}>
															<Link to="/open/detail/1" className="more">
																<Avatar
																	style={{ marginLeft: 10 }}
																	size={20}
																	icon={<Icon type="user" />}
																	src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																/>
																<span style={{ marginLeft: 10 }}>
																	{item.lawyer.name}
																</span>
																<span style={{ marginLeft: 120 }}>15:00</span>
																<p className="fonsse">{item.content}</p>
															</Link>
														</Menu.Item>
													))}
													<Menu.Divider />
													<Menu.Item key="mores">
														<Link to="/open/mine" className="more">
															查看我的咨询
														</Link>
													</Menu.Item>
												</Menu>
											}
										>
											<Button type="primary" ghost className="rf">
												我的咨询
												<Icon type="file" />
											</Button>
										</Dropdown>
									</div>
								</Row>
							</div>
						</div>
						{/* <!-- 底部帖子讨论部分 --> */}
						<div id="attentions">
							{/* <!-- 排序 --> */}
							<div className="attention">
								<Tabs defaultActiveKey="hot">
									<Tabs.TabPane tab="推荐" key="hot" />
									<Tabs.TabPane tab="热门" key="new" />
									<Tabs.TabPane tab="精华" key="hot2" />
								</Tabs>
							</div>
							{/* <!-- 帖子讨论部分 --> */}
							{this.state.list.map(item => (
								<div key={item.id} className="discussion">
									{/* <!-- 内容 --> */}
									<div className="div_discussion">
										{/* 主体内容 */}
										<Link to="/open/detail/1">
											<p className="content">{item.content}</p>
										</Link>
										{/* 时间 */}
										<span className="separates">{item.created}</span>
										{/* 头像 */}
										<span className="glyphicon glyphicon-globe separatc">
											{item.consultant.head_img}
										</span>
									</div>
									{/* <!-- 类型 --> */}
									<div className="tyep_family">
										<p className="family">{item.type.name}</p>
									</div>
									{/* <!-- 内容参数--> */}
									<div className="open_Indexcontent">
										<span className="glyphicon glyphicon-map-marker glyphiconss"></span>
										<span className="span_glyphicon ">
											{item.area.parent.name}
										</span>
										<Icon
											type="message"
											theme="filled"
											style={{ color: "#c2c2c2" }}
											className="my_time"
										/>
										<i className="my_num">{item.comment_num}</i>
										<span className="glyphicon glyphicon-thumbs-up my_sie"></span>
										<i className="mytime">{item.like_num}</i>
									</div>
									<div style={{ clear: "both" }}></div>
								</div>
							))}
							<div className="load">
								<span className="span_load">加载更多....</span>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapDispath = dispath => {
	return {
		//改变弹出框状态
		changePopupBox(info) {
			dispath(changePopupBox(info));
		}
	};
};

export default connect(null, mapDispath)(Index);
