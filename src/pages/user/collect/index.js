import React, { Component, Fragment } from "react";
import { Icon } from "antd";
import "./index.css";
import moment from "moment";
import { myRequest } from "../../../function";
class Index extends Component {
	state = {
		List: [] // 我的收藏列表
	};
	// 获取我的收藏列表
	getConsult() {
		let that = this;
		myRequest({
			method: "get",
			auth: true,
			path: "/consultant/open/index/my_collection",
			callback: function(response) {
				if (response.data.code === 0) {
					that.setState({
						List: response.data.data
					});
				}
			}
		});
	}
	render() {
		return (
			<Fragment>
				{/* <!-- 标题 --> */}
				<p className="enshrine">我的收藏</p>
				<div className="bgcol">
					{this.state.List.map(item => (
						<Fragment>
							{/* <!-- 帖子讨论部分 --> */}
							<div key={item.id} className="user_collect">
								{/* 内容时间 */}
								<div>
									<div>
										<p className="contents">{item.content}</p>
									</div>
									<div style={{ float: "right", marginRight: "15px" }}>
										<span
											className="glyphicon glyphicon-globe"
											style={{ marginRight: "15px" }}
										></span>
										<span>{moment(item.created).format("YYYY-MM-DD ")}</span>
									</div>
								</div>
								{/* <!-- 类型 --> */}
								<div style={{ float: "left" }}>
									<p className="users_familys">{item.type.parent.name}</p>
								</div>
								{/* <!-- 内容标签 --> */}
								<div style={{ float: "right" }}>
									<Icon type="environment" className="user_location" />
									<span className="user_area_name">{item.area.name}</span>
									<Icon
										type="message"
										style={{ fontSize: "12px", marginRight: "6px" }}
									/>
									<i className="user_comment_num">{item.comment_num}</i>
									<Icon
										type="like"
										style={{ fontSize: "12px", marginRight: "6px" }}
									/>
									<i className="user_like_num">{item.like_num}</i>
								</div>
                <div style={{ clear: "both" }}></div>
							</div>
				
						</Fragment>
					))}
				</div>
			</Fragment>
		);
	}
	componentDidMount() {
		this.getConsult(); // 我的收藏列表
	}
}

export default Index;
