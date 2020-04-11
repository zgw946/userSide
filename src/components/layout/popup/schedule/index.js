import React, { PureComponent } from "react";
import "./index.css";
import moment from "moment";
import { fromJS } from "immutable";
import { changePopupBox } from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import { Divider, Calendar, Badge, Modal, Popover, Icon } from "antd";
import { myRequest } from "../../../../function";

class Index extends PureComponent {
	state = {
		list: [], // 我的日程列表
		task: {}, // 当月任务列表
		year: moment().format("YYYY"), //获取当前的年份
		month: moment().format("MM"), // 获取当前的月
		contents: "", // 详细日程的内容
		begin: "", // 开始时间
		end: "", // 结束时间
		locations: "" // 地点
	};

	render() {
		const { contents, begin, end, locations } = this.state;

		function getListData(value) {
			let listData;
			const content = (
				<div>
					<span className="roundne3"></span>
					<span style={{ margin: "0px 0px 0px 18px", color: "#333" }}>
						{contents}
					</span>
					<p style={{ margin: "0px 0px 2px 0px" }}>
						<Icon
							type="dashboard"
							theme="twoTone"
							style={{ margin: "0px 0px 0px 15px" }}
						/>
						<span
							style={{
								fontSize: "12px",
								color: "#333",
								margin: "0px 0px 0px 10px"
							}}
						>
							{moment(begin).format("HH:mm")}-
						</span>
						<span style={{ fontSize: "12px", color: "#333" }}>
							{moment(end).format("HH:mm")}
						</span>
					</p>
					<p>
						<Icon
							type="environment"
							theme="twoTone"
							style={{ margin: "0px 0px 0px 15px" }}
						/>
						<span
							style={{
								fontSize: "14px",
								color: "#333",
								margin: "0px 0px 0px 10px"
							}}
						>
							{locations}
						</span>
					</p>
				</div>
			);
			let tasks = (
				<Popover content={content} placement="bottom" trigger="hover">
					<span style={{ fontSize: 12 }}>预约</span>
				</Popover>
			);
			switch (value.date()) {
				case 12:
					listData = [{ type: "warning", content: tasks }];
					break;
				default:
			}
			return listData || [];
		}

		function dateCellRender(value) {
			const listData = getListData(value);
			return (
				<ul className="events">
					{listData.map(item => (
						<li key={item.content}>
							<Badge status={item.type} text={item.content} />
						</li>
					))}
				</ul>
			);
		}

		function getMonthData(value) {
			if (value.month() === 8) {
				return;
			}
		}

		function monthCellRender(value) {
			const num = getMonthData(value);
			return num ? (
				<div className="notes-month">
					<section>{num}</section>
				</div>
			) : null;
		}

		return (
			<Modal
				width={520}
				destroyOnClose={true}
				footer={null}
				onCancel={() =>
					this.props.changePopupBox([{ type: this.props.popupType }])
				}
				visible={true}
			>
				<div className="schedule">
					{/* <!-- 我的日程标题 --> */}
					<div className="my_schedule">
						<p className="myp_schedule">我的日程</p>
					</div>
					{/* <!-- 年份日期选择 --> */}
					<div className="date_time">
						<Calendar
							fullscreen={false}
							dateCellRender={dateCellRender}
							monthCellRender={monthCellRender}
						/>
					</div>
					{/* <!-- 我的任务 --> */}
					<div className="assignments">
						{/* 任务详细 */}
						{/* 对象遍历 name key */}
						{Object.keys(this.state.task).map(name => {
							let item = this.state.task[name]; // 每月时间
							return (
								<div key={name}>
									<div style={{ float: "left" }}>
										<span>{name}</span>
										<span style={{ marginLeft: 15 }}>
											{moment(name.created).format("ddd")}
										</span>
									</div>
									<div style={{ clear: "both" }}></div>
									{item.map(itemChild => (
										<div
											key={itemChild.id}
											style={{ margin: "0px 0px 23px 0px" }}
										>
											{/* 分割线 */}
											<Divider style={{ margin: "10px 0px" }} />
											<div style={{ float: "left" }}>
												<span className="begin">
													{moment(itemChild.begin).format("HH时mm分")}
												</span>
												<br />
												<span className="end">
													{moment(itemChild.end).format("HH时mm分")}
												</span>
											</div>
											<div style={{ float: "left" }}>
												<span className="roundness"></span>
												<span
													style={{ margin: "0px 0px 0px 40px", color: "#333" }}
												>
													{itemChild.content}
												</span>
												<br />
												<span
													style={{
														margin: "0px 0px 0px 40px",
														color: "#666666",
														fontSize: "12px"
													}}
												>
													{itemChild.location}
												</span>
											</div>
											<div style={{ clear: "both" }}></div>
											{/* 全天 */}
											<div
												style={{ float: "left", margin: "10px 0px 0px 0px" }}
											>
												<span className="timex">全天</span>
											</div>
											<div
												style={{ float: "left", margin: "10px 0px 0px 0px" }}
											>
												<span className="roundnesss"></span>
												<span
													style={{ margin: "0px 0px 0px 66px", color: "#333" }}
												>
													{itemChild.content}
												</span>
												<br />
												<span
													style={{
														margin: "0px 0px 0px 66px",
														color: "#666666",
														fontSize: "12px"
													}}
												>
													{itemChild.location}
												</span>
											</div>
											<div style={{ clear: "both" }}></div>
										</div>
									))}
								</div>
							);
						})}
					</div>
					<div style={{ clear: "both" }}></div>
				</div>
			</Modal>
		);
	}

	// 我的任务列表
	taskPost() {
		let that = this;
		myRequest({
			method: "get",
			auth: true,
			path: "/consultant/user/schedule",
			params: {
				year: this.state.year,
				month: this.state.month
			},
			callback: function(response) {
				console.log('====================================');
				console.log(response);
				console.log('====================================');
				if (response.data.code === 0) {
					// 把数据转化成fromJS对象
					let task = fromJS(that.state.task);
					response.data.data.map(item => {
						// 输入日期格式
						let beginDate = moment(item.begin).format("MM月DD日");
						let dayTask = task.get(beginDate);
						if (dayTask) {
							dayTask.push(item);
						} else {
							dayTask = [item];
						}
						task = task.set(beginDate, dayTask);

						return null;
					});
					that.setState({
						task: task.toJS(), //
						list: response.data.data
					});
				}
			}
		});
	}

	// 获取任务详细列表
	taskDetail() {
		let that = this;
		myRequest({
			method: "get",
			path: "/consultant/user/schedule/1",
			auth: true,
			callback: function(response) {
				if (response.data.code === 0) {
					that.setState({
						contents: response.data.data.content,
						begin: response.data.data.begin,
						end: response.data.data.end,
						locations: response.data.data.location
					});
				}
			}
		});
	}

	// 获取当前的年份
	yearSet() {
		this.setState({
			year: moment(this.state.year)
		});
	}

	// 获取当前的月份
	monthSet() {
		this.setState({
			month: moment(this.state.month)
		});
	}

	// 运行
	componentDidMount() {
		this.yearSet(); // 获取当前的年份
		this.monthSet(); // 获取当前的月份
		this.taskPost(); // 日程
		this.taskDetail(); // 获取任务详细列表
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

//数据仓库
Index = connect(null, mapDispath)(Index);

export default Index;
