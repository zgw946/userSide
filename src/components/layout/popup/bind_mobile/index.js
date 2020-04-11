import React, { PureComponent } from "react";
import "./index.css";
import { Modal, Form, Button, Input, message } from "antd";
import { changePopupBox } from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import { myRequest } from "../../../../function";
import { getUserInfo } from "../../header/actionCreators";
//绑定手机
class Index extends PureComponent {
	state = {
		disabledBtn: false, //是否使按钮失效
		leftTime: 120, //重置按钮剩余时间
		visible: true // 弹框的显示隐藏
	};

	//发送验证码
	sendCode() {
		//验证账号
		this.props.form.validateFields(["mobile"], (err, values) => {
			let that = this; //赋值父类
			//验证成功发送请求
			if (!err) {
				let form = this.props.form;
				myRequest({
					method: "post",
					path: "/common/message/send",
					data: {
						mobile: values.mobile,
						user_type: 1,
						code_type: 2
					},
					callback: function(response) {
						//处理返回结果
						if (response.data.code !== 0) {
							//错误提示
							form.setFields({
								code: {
									errors: [new Error(response.data.msg)]
								}
							});
						} else {
							//关闭错误提示
							form.setFields({
								code: {}
							});

							//改变按钮状态
							that.setState({
								disabledBtn: true
							});
							that.changeBtn(); //发送验证码改变按钮
							//测试环境直接弹窗显示验证码
							if (response.data.data) {
								Modal.success({
									title: "验证码",
									content: response.data.data.code
								});
							}
						}
					}
				});
			}
		});
	}

	//改变按钮状态
	changeBtn() {
		//改变按钮状态
		this.setState({
			disabledBtn: true
		});
		let that = this; //赋值父类

		//实时改变按钮状态
		let interval = setInterval(() => {
			let left = that.state.leftTime - 1;
			that.setState({
				leftTime: left
			});
			//如果间隔时间小于0，重置按钮
			if (this.state.leftTime <= 0) {
				//清楚定时器
				clearInterval(interval);
				this.setState({
					disabledBtn: false,
					leftTime: 120
				});
			}
		}, 1000);
	}

	//成功后
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let that = this;
				//提交请求
				myRequest({
					method: "post",
					path: "/common/auth/bind_mobile",
					auth: true,
					data: {
						mobile: values.mobile,
						code: values.code
					},
					callback: function(response) {
						//处理返回结果
						if (response.data.code === 0) {
							message.success(response.data.msg);
							that.props.getUserInfo();
							that.props.changePopupBox([{ type: "bind_mobile" }]);
							// 成功后关闭弹框
						} else {
							message.error(response.data.msg);
						}
					}
				});
			}
		});
	};
	handleCancel = () => {
		this.setState({ visible: false });
	};

	componentDidMount() {}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal
				width={460}
				destroyOnClose={true}
				footer={null}
				onCancel={() =>
					this.props.changePopupBox([{ type: this.props.popupType }])
				}
				visible={this.state.visible}
			>
				<h2
					style={{
						fontSize: "16px",
						fontWeight: "bold",
						textAlign: "center",
						color: "#333"
					}}
				>
					绑定手机
				</h2>

				<Form
					onSubmit={this.handleSubmit}
					style={{ marginLeft: "7px" }}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 12 }}
				>
					<Form.Item
						label="手机"
						style={{
							color: "#333",
							fontSize: "16px",
							margin: "0px 0px 15px 0px"
						}}
					>
						{getFieldDecorator("mobile", {
							rules: [
								{ required: true, message: "请输入手机号码" },
								{
									pattern: "^[1][3,4,5,7,8][0-9]{9}$",
									message: "用户名必须为手机号码"
								}
							]
						})(<Input style={{ width: "320px" }} placeholder="请输入手机号" />)}
					</Form.Item>
					<Form.Item
						label="验证码"
						style={{
							color: "#333",
							fontSize: "16px",
							margin: "0px 0px 15px 0px"
						}}
					>
						{getFieldDecorator("code", {
							rules: [
								{ required: true, message: "请输入验证码" },
								{ len: 6, message: "验证码长度必须为6" }
							]
						})(
							<Input
								type="mobile"
								style={{ width: "200px" }}
								placeholder="请输入验证码"
							/>
						)}

						{this.state.disabledBtn ? (
							<Button
								style={{
									backgroundColor: "#fff",
									color: "#ccc",
									position: "absolute",
									top: "-4px",
									left: "220px"
								}}
							>
								{this.state.leftTime}秒后可获取
							</Button>
						) : (
							<Button
								style={{
									backgroundColor: "#fff",
									color: "#ccc",
									position: "absolute",
									top: "-4px",
									left: "237px"
								}}
								onClick={() => this.sendCode()}
							>
								获取验证码
							</Button>
						)}
					</Form.Item>
					<Button
						size="small"
						style={{
							backgroundColor: "#fff",
							color: "#ccc",
							width: "70px",
							marginLeft: "100px"
						}}
						// onClick={this.handleCancel}
						onClick={() => this.props.changePopupBox([{ type: "bind_mobile" }])}
					>
						取消
					</Button>
					<Button
						htmlType="submit"
						size="small"
						style={{
							backgroundColor: "#0192fe",
							color: "#fff",
							width: "70px",
							marginLeft: "20px"
						}}
					>
						确定
					</Button>
				</Form>
				<span style={{ float: "right", color: "#0192fe" }}>返回仁法网</span>
			</Modal>
		);
	}
}

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
//数据仓库
export default connect(null, mapDispath)(Form.create()(Index));
