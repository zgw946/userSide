import React, { PureComponent } from "react";
import "./index.css";
import { Modal, Form, Button, Input, message } from "antd";
import { changePopupBox } from "../actionCreators";
import { myRequest } from "../../../../function";
import connect from "react-redux/es/connect/connect";
import { getUserInfo } from "../../header/actionCreators";
//绑定手机
class Index extends PureComponent {
	render() {
		// const {userInfo} = this.props; //用户信息
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal
				width={500}
				destroyOnClose={true}
				footer={null}
				onCancel={() =>
					this.props.changePopupBox([{ type: this.props.popupType }])
				}
				visible={true}
			>
				<h2
					style={{
						fontSize: "16px",
						fontWeight: "bold",
						textAlign: "center",
						color: "#333"
					}}
				>
					修改密码
				</h2>
				<Form
					onSubmit={this.handleSubmit}
					labelCol={{ span: 5 }}
					wrapperCol={{ span: 18 }}
				>
					<Form.Item
						hasFeedback
						label="旧密码:"
						style={{
							color: "#333",
							fontSize: "16px",
							margin: "0px 0px 15px 0px"
						}}
					>
						{getFieldDecorator("old_password", {
							rules: [
								{ required: true, message: "请输入旧密码" },
								{ min: 8, message: "密码长度至少为8" }
							]
						})(
							<Input
								style={{ width: "320px" }}
								placeholder="请输入旧密码"
								type="password"
							/>
						)}
					</Form.Item>
					<Form.Item
						hasFeedback
						label="新密码:"
						style={{
							color: "#333",
							fontSize: "16px",
							margin: "0px 0px 0 0px",
							boxSizing: "content-box"
						}}
					>
						{getFieldDecorator("password", {
							rules: [
								{ required: true, message: "请输入新密码" },
								{ min: 8, message: "密码长度至少为8" },
								{ validator: this.validateToNextPassword }
							]
						})(
							<Input.Password
								style={{ width: "320px" }}
								placeholder="请输入新的密码"
								type="password"
							/>
						)}
					</Form.Item>
					<Form.Item
						hasFeedback
						label="确认新密码:"
						style={{
							color: "#333",
							fontSize: "16px",
							margin: "11px 0px 15px 0px"
						}}
					>
						{getFieldDecorator("confirm_password", {
							rules: [
								{ required: true, message: "请再次输入密码" },
								{ min: 8, message: "密码长度至少为8" },
								{ validator: this.compareToFirstPassword }
							]
						})(
							<Input.Password
								style={{ width: "320px" }}
								placeholder="请再次输入密码"
								type="password"
							/>
						)}
					</Form.Item>
					<Button
						type="primary"
						size="small"
						htmlType="submit"
						style={{
							backgroundColor: "#0192fe",
							color: "#fff",
							width: "70px",
							marginLeft: "150px"
						}}
					>
						确定
					</Button>
					<Button
            onClick={() => this.props.changePopupBox([{type : 'update_password'}])}
						size="small"
						style={{
							backgroundColor: "#fff",
							color: "#ccc",
							width: "70px",
							marginLeft: "20px"
						}}
					>
						取消
					</Button>
				</Form>
				<span style={{ float: "right", color: "#0192fe" }}>返回仁法网</span>
			</Modal>
		);
	}

	//校验确认密码是否与密码一致
	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue("password")) {
			callback("密码输入不一致");
		} else {
			callback();
		}
	};
	//改变密码后再次判断两次输入密码是否一致
	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (
			form.getFieldValue("confirm_password") &&
			value !== form.getFieldValue("confirm_password")
		) {
			form.validateFields(["confirm_password"], { force: true });
		} else {
			//关闭错误提示
			form.setFields({
				confirm_password: {
					value: form.getFieldValue("confirm_password")
				}
			});
		}
		callback();
	};
	//处理表单提交
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let that = this;
				//提交请求
				myRequest({
					method: "put",
					path: "/common/auth/update_password",
					auth: true,
					data: {
						old_password: values.old_password,
						password: values.password,
					},
					callback: function(response) {
						//处理返回结果
						if (response.data.code === 0) {
							message.success("修改成功");
							//更新用户信息
							that.props.getUserInfo();
							that.props.changePopupBox([{ type: "update_password" }]);
						} else {
							message.error(response.data.msg);
						}
					}
				});
			}
		});
	};
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
		},
		//设置用户信息
		getUserInfo() {
			dispath(getUserInfo());
		}
	};
};
//数据仓库
export default connect(mapState, mapDispath)(Form.create()(Index));
