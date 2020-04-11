import React, { PureComponent } from "react";
import "./index.css";
import { message, Modal, Button } from "antd";
import { changePopupBox } from "../actionCreators";
import { myRequest } from "../../../../function";
import { connect } from "react-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
class Index extends PureComponent {
	state = {
		src: null,
		crop: {
			unit: "%",
			width: 30,
			height: 30,
			aspect: 16 / 9
		},
		lastFile: null,
		head_img: 0 // 头像
	};
	onSelectFile = e => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () =>
				this.setState({ src: reader.result })
			);
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	async makeClientCrop(crop, pixelCrop) {
		if (this.imageRef && crop.width && crop.height) {
			const croppedImageUrl = await this.getCroppedImg(
				this.imageRef,
				pixelCrop,
				"newFile.jpeg"
			);
			this.setState({ croppedImageUrl });
		}
	}

	onImageLoaded = (image, pixelCrop) => {
		this.imageRef = image;
		const { crop } = this.state;
		if (crop.aspect && crop.height && crop.width) {
			this.setState({
				crop: { ...crop, height: null }
			});
		} else {
			this.makeClientCrop(crop, pixelCrop);
		}
	};

	onCropComplete = (crop, pixelCrop) => {
		this.makeClientCrop(crop, pixelCrop);
	};

	onCropChange = crop => {
		this.setState({ crop });
	};

	getCroppedImg(image, pixelCrop, fileName) {
		const canvas = document.createElement("canvas");
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;
		const ctx = canvas.getContext("2d");
		let that = this;

		ctx.drawImage(
			image,
			pixelCrop.x * scaleX,
			pixelCrop.y * scaleY,
			pixelCrop.width * scaleX,
			pixelCrop.height * scaleY,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob(file => {
				if (file) {
					file.name = fileName;
					window.URL.revokeObjectURL(this.fileUrl);
					this.fileUrl = window.URL.createObjectURL(file);
					resolve(this.fileUrl);
					//转换为file对象
					let lastFile = new window.File([file], fileName, { type: file.type });
					that.setState({ lastFile });
				} else {
					that.setState({ croppedImageUrl: null });
				}
			}, "image/jpeg");
		});
	}
	render() {
		const { croppedImageUrl } = this.state;
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
				{/* <!-- 大容器 --> */}
				<div>
					{/* <!-- heads --> */}
					<div className="div_headss">
						<p className="p_heads">头像裁剪</p>
					</div>
					<div className="mb20" style={{ marginTop: "20px" }}>
						<input
							type="file"
							accept="image/*"
							onChange={this.onSelectFile}
							style={{ border: "0px", outline: "none", float: "left" }}
						/>
						<span
							style={{
								float: "right",
								marginRight: "70px",
								color: "#333",
								fontSize: "16px"
							}}
						>
							预览效果
						</span>
						<div style={{ clear: "both" }}></div>
					</div>
					<div>
						<div className="lf border1_eee" style={{ width: 200, height: 200 }}>
							{this.state.src && (
								<ReactCrop
									ruleOfThirds
									src={this.state.src}
									crop={this.state.crop}
									onImageLoaded={this.onImageLoaded}
									onComplete={this.onCropComplete}
									onChange={this.onCropChange}
								/>
							)}
						</div>
						<div
							className="border1_eee"
							style={{
								width: "200px",
								height: "200px",
								marginLeft: "10px",
								float: "right",
								textAlign: "center",
								lineHeight: "200px"
							}}
						>
							{croppedImageUrl && (
								<img
									style={{ width: "100px", height: "100px" }}
									alt="Crop"
									src={croppedImageUrl}
								/>
							)}
						</div>
					</div>
				</div>
				<div style={{ clear: "both" }}></div>
				<div className="fossts">
					<Button
						onClick={() =>
							this.props.changePopupBox([{ type: "change_avatar" }])
						}
						type="primary"
						style={{
							marginLeft: 30,
							width: 70,
							height: 26,
							backgroundColor: "#CCCCCC",
							color: "#fff",
							border: "0px"
						}}
					>
						取消
					</Button>
					<Button
						onClick={() => this.submitCropImage(this.state.lastFile)}
						type="primary"
						style={{
							marginLeft: 15,
							width: 70,
							height: 26,
							backgroundColor: "#2e3341",
							color: "#fff",
							border: "0px"
						}}
					>
						确认
					</Button>
				</div>
			</Modal>
		);
	}
	//确定裁剪图片
	submitCropImage(file) {
		let that = this;
		let form = new FormData(); // 可以增加表单数据
		form.append("file", file); // 文件对象
		form.append("type", "image"); // 文件类型
		//上传图片
		if (file) {
			myRequest({
				method: "post",
				path: "/common/file/upload",
				data: form,
				auth: true,
				callback: function(response) {
					//处理返回结果
					if (response.data.code === 0) {
						that.setState(
							{
								head_img: response.data.data.id
							},
							() => {
								that.userImg(); // 获取头像
								that.props.changePopupBox([{ type: "change_avatar" }]); //关闭图像裁剪弹窗
							}
						);
					} else {
						message.error(response.data.msg);
					}
				}
			});
		} else {
			message.error("请选择图片");
		}
	}
	userImg() {
		let that = this;
		myRequest({
			method: "PUT",
			path: "/consultant/user/index",
			data: {
				head_img: that.state.head_img
			},
			auth: true,
			callback: function(response) {
				if (response.data.code === 0) {
					message.success("头像修改成功");
				} else {
					message.error(response.data.msg);
				}
			}
		});
	}
}
const mapState = state => {
	return {
		showBox: state.getIn(["popup", "showBox"])
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

//数据仓库
Index = connect(mapState, mapDispath)(Index);

export default Index;
