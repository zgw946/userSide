import React, { Component, Fragment } from "react";
import "./index.css";
import {
	Avatar,
	Icon,
	message,
	Popover,
	Upload,
	Input,
	Divider,
	Form,
	Button
} from "antd";
import { changePopupBox } from "../../../../components/layout/popup/actionCreators";
import connect from "react-redux/lib/connect/connect";
import {
	computationType,
	getFileSize,
	getLocalStorage,
	myRequest
} from "../../../../function";
import ReconnectingWebSocket from "reconnecting-websocket";
import { DOMAIN, ONLY_DOMAIN } from "../../../../constant";
import moment from "moment";

const content = (
	<div className="myemojis">
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
		<Icon className="emojis" type="meh" theme="twoTone" />
	</div>
);

//法律顾问聊天组件
class Index extends Component {
	state = {
		list: [], //会话详情容器
		page: 1, //当前显示页数
		pageSize: 20, //每页显示数据数量
		totalPage: 0, //数据总页数
		rws: null, //即时通讯长连接
		message: "" //输入框内容
	};

	//修改显示数量
	getMore() {
		this.setState(
			{
				pageSize: this.state.pageSize + 20
			},
			() => this.getAdviserDetail()
		);
	}

	//获取会话内容
	getAdviserDetail() {
		let that = this;
		myRequest({
			method: "get",
			path: "/consultant/conversation/adviser",
			params: {
				page: that.state.page,
				page_size: that.state.pageSize
			},
			auth: true,
			callback: function(response) {
				if (response.data.code === 0) {
					let originalList = [];
					if (response.data.data.list) {
						originalList = response.data.data.list.reverse();
					}

					let list = []; //最新的本地数据

					//划分时间段（每分钟为一个区间）
					originalList.map(item => {
						let key = moment(item.created, "YYYY-MM-DD hh:mm").calendar();

						//判断数组是否存在
						if (!list[key]) {
							list[key] = [];
						}

						list[key].push(item);

						return null;
					});

					that.setState(
						{
							list,
							totalPage: response.data.data.total_page
						},
						() => {
							//首次获取内容时跳到最新的消息
							if (that.state.pageSize === 20) {
								that.contentNode.scrollTop = that.contentNode.scrollHeight;
							}

							//判断会话是否开启
							if(!that.state.rws) {
								//获取会话详情后开启正常会话
								that.makeWebSocket();
							}
						}
					);
				}
			}
		});
	}

	//建立websocket
	makeWebSocket() {
		const token = getLocalStorage("api_token");

		if (token) {
			let url =
				"ws://" +
				ONLY_DOMAIN +
				"/common/conversation/adviser/open_conversation?token=" +
				encodeURIComponent(token);
			// 建立websocket 连接
			let rws = new ReconnectingWebSocket(url);

			//开启时将连接赋值到state中去
			rws.addEventListener("open", () => {
				this.setState({
					rws
				});
			});

			rws.addEventListener("message", e => {
				if (e.data) {
					const newMessage = JSON.parse(e.data);
					this.addList(newMessage);
				}
			});

			// 错误时进行的处理
			rws.addEventListener("error", e => {
				message.error("会话连接失败，请重试！");
			});
		}
	}

	//把消息添加进消息列表
	addList(message) {
		// 这里是你拿到数据后进行的处理
		//你可以调用action 来触发消息给页面上展示 例如 这些消息方法需要你自己来封装
		let list = this.state.list;

		//划分时间段（每分钟为一个区间）
		let key = moment(message.created, "YYYY-MM-DD hh:mm").calendar();

		//判断数组是否存在
		if (!list[key]) {
			list[key] = [];
		}

		list[key].push(message);

		//判断聊天信息框是否滚动到最新消息
		let bottom = false;
		if (this.contentNode.scrollHeight && this.contentNode.scrollTop) {
			if (this.contentNode.scrollHeight - this.contentNode.scrollTop <= 400) {
				bottom = true;
			}
		}

		this.setState(
			{
				list
			},
			() => {
				//当消息框不是滚动到最下面时，如果接收到的是自己发送的消息则滚动到最底部
				if (message.member_type === 1 || bottom) {
					this.contentNode.scrollTop = this.contentNode.scrollHeight;
				}
			}
		);
	}

	//同步输入框的内容
	syncMessage(e) {
		this.setState({
			message: e.target.value.replace(/[\r\n]/g, "")
		});
	}

	//发送文本消息
	sendText() {
		let sendMessgae = this.state.message; //获取文本框中内容

		//输入框有内容时才允许发送
		if (sendMessgae) {
			let message = {};
			message.content = sendMessgae; //消息内容
			this.state.rws.send(JSON.stringify(message));
			this.setState(
				{
					message: ""
				},
				() => {
					//模拟消息
					let imitateData = {};
					imitateData.id = new Date().getTime();
					imitateData.type = 1;
					imitateData.member_type = 1;
					imitateData.content = sendMessgae;
					imitateData.created = moment().format("YYYY-MM-DD HH:mm");
					this.addList(imitateData);
				}
			);
		}
	}

	//发送文件
	sendFile(info) {
		// if (info.file.status !== 'uploading') {
		//   console.log(info.file, info.fileList);
		// }
		if (info.file.status === "done") {
			let message = {};
			const file = info.file.response.data;
			message.file = { id: file.id }; //消息内容
			this.state.rws.send(JSON.stringify(message));

			//模拟消息
			let imitateData = {},
				imitateFile = {};

			//设置文件信息
			imitateFile.id = file.id;
			imitateFile.type = file.type;
			imitateFile.url = file.url;
			imitateFile.original_name = file.original_name;
			imitateFile.size = file.size;

			//设置模拟消息
			imitateData.id = new Date().getTime();
			imitateData.member_type = 1;
			imitateData.file = imitateFile;
			imitateData.created = moment().format("YYYY-MM-DD HH:mm");
			this.addList(imitateData);
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} 上传失败`);
		}
	}

	//初始化组件
	componentDidMount() {
		this.getAdviserDetail();
	}

	componentWillUnmount() {

		//判断会话是否开启
		if(this.state.rws) {
			//获取会话详情后开启正常会话
			this.state.rws.close();
		}

	}

	render() {
		const list = this.state.list; //消息列表

		return (
			<Fragment>
				<div className="hangs">
					<p className="p_hangs">法律顾问</p>
				</div>
				<div className="mycontent">
					<div ref={node => (this.contentNode = node)} className="my_counselor">
						{//判断是否已展示全部消息
							this.state.totalPage <= 1 ? null : (
								<Button
									onClick={() => this.getMore()}
									style={{ marginLeft: 287 }}
									type="link"
								>
									查看更多记录
								</Button>
							)}
						{Object.keys(list).map(time => {
							const item = list[time];

							return (
								<div key={time} className="message_box">
									<p className="tac f12px">{time}</p>
									{item.map(itemChild => (
										<Fragment key={itemChild.id}>
											{itemChild.member_type === 1 ? (
												<Avatar
													src={this.props.userInfo.head_img}
													size={40}
													shape="square"
													icon="user"
													className="message_head rf"
												/>
											) : (
												<Avatar
													src={require("../../../../statics/images/聊天界面/avatar_robot.png")}
													size={40}
													shape="square"
													icon="user"
													className="message_head lf"
												/>
											)}
											<div
												className={
													"message_content " +
													(itemChild.member_type === 1 ? "rf mr26" : "lf ml25")
												}
											>
												{itemChild.type === 1 ? (
													<span style={{ color: "#333" }}>
													{itemChild.content}
												</span>
												) : (
													<div>
														{/* 音乐视频 */}
														<div
															style={{
																float: "left",
																margin: "8px 5px 5px 10px"
															}}
														>
															{(() => {
																const file = itemChild.file;
																const fileType = file.type.replace(".", "");
																const type = computationType(fileType); //计算类型
																let cover = ""; //封面
																switch (type) {
																	case "image":
																		cover = file.url;

																		break;
																	case "word":
																		cover = require("../../../../statics/images/word.png");

																		break;
																	case "text":
																		cover = require("../../../../statics/images/text.png");

																		break;
																	case "excel":
																		cover = require("../../../../statics/images/excel.png");

																		break;
																	case "ppt":
																		cover = require("../../../../statics/images/ppt.png");

																		break;
																	case "pdf":
																		cover = require("../../../../statics/images/pdf.png");

																		break;
																	case "packet":
																		cover = require("../../../../statics/images/yasuobao.png");

																		break;
																	default:
																		cover = require("../../../../statics/images/weizhiwenjian.png");

																		break;
																}

																return (
																	<Avatar shape="square" size={42} src={cover} />
																);
															})()}
														</div>
														{/* 详细说明 */}
														<div
															style={{
																float: "right",
																margin: "8px 10px 5px 0px"
															}}
														>
														<span className="counselor_file_name">
															{itemChild.file.original_name}
														</span>
															<span
																style={{
																	color: "#ccc",
																	fontSize: "12px"
																}}
															>
															{getFileSize(itemChild.file.size)}
														</span>
														</div>
														{/* 保存区域 */}
														<Divider style={{ marginBottom: "0px" }} />
														<div>
														<span
															style={{
																color: "#4586ff",
																float: "right",
																fontSize: "12px",
																marginRight: "8px"
															}}
														>
															下载
														</span>
															<span
																style={{
																	color: "#4586ff",
																	float: "right",
																	fontSize: "12px",
																	marginRight: "8px"
																}}
															>
															打开
														</span>
														</div>
													</div>
												)}
											</div>

											<div className="clearfix"></div>
										</Fragment>
									))}
								</div>
							);
						})}
					</div>
					<div className="wires">
						<Form onSubmit={this.sendMessage}>
							{/* 表情包 */}
							<div
								style={{
									float: "left",
									width: "14px",
									marginLeft: "10px"
								}}
							>
								<Popover content={content} trigger="focus">
									<button className="emoji">
										<Icon type="smile" />
									</button>
								</Popover>
							</div>
							{/* 上传文件夹 */}
							<div
								style={{
									float: "left",
									width: "14px",
									marginLeft: "10px"
								}}
							>
								<Upload
									accect="*"
									action={DOMAIN + "/common/file/upload"}
									name="file"
									showUploadList={false}
									onChange={info => this.sendFile(info)}
								>
									<Icon type="file-text" />
								</Upload>
							</div>
							{/* 聊天输入框 */}
							<Input.TextArea
								onChange={e => this.syncMessage(e)}
								onPressEnter={() => this.sendText()}
								rows={5}
								value={this.state.message}
								className="dopes mt5"
								placeholder="请输入相关内容"
							/>
						</Form>
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
const mapDispath = dispath => {
	return {
		//改变弹出框状态
		changePopupBox(info) {
			dispath(changePopupBox(info));
		}
	};
};

Index = connect(mapState, mapDispath)(Index);

export default Index;
