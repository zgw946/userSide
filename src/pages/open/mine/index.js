import React, { Component, Fragment } from "react";
import "../index.css";
import { Button, Icon, Input, Row, Col, message } from "antd";
import { changePopupBox } from "../../../components/layout/popup/actionCreators";
import connect from "react-redux/es/connect/connect";
import { Link } from "react-router-dom";
import { myRequest } from "../../../function";

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
			path: "/consultant/open/index",
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
	//初始化组件
	componentDidMount() {
		this.getList(); // 获取评论列表
	}

	render() {
		return (
			<Fragment>
					{/* <!-- 法律广场 --> */}
					<div 	style={{
						backgroundColor: "#f5f5f5",
						height:"auto"
					}}>
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
										<Link to="/open/index">
											<Button type="primary" ghost className="rf">
												回到广场
												<Icon type="retweet" />
											</Button>
										</Link>
									</div>
								</Row>
							</div>
						</div>
						{/* <!-- 底部帖子讨论部分 --> */}
						<div id="attentions">
							{/* <!-- 帖子讨论部分 --> */}
							{this.state.list.map(item => (
								<div key={item.id} className="discussion">
									{/* <!-- 标题 --> */}
									<div className="div_discussion">
										<p className="div_title">{item.type.name}</p>
										<span className="separates">{item.created}</span>
										<span className="glyphicon glyphicon-globe separatc">
											{item.consultant.head_img}
										</span>
									</div>
									{/* <!-- 内容 --> */}
									<div>
										<Link to="/open/detail/1">
											<p className="content">{item.content}</p>
										</Link>
										<div className="open_content">
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
									</div>
									{/* <!-- 标签 --> */}
									<div className="tyep_familys">
										<p className="family">{item.type.name}</p>
									</div>
									<div style={{ clear: "both" }}></div>
								</div>
							))}
							<div className="load">
								<span className="span_load">加载更多....</span>
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
