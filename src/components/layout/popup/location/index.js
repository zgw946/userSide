import React, { PureComponent, Fragment } from "react";
import "./index.css";
import { Modal, Button, Radio, Spin } from "antd";
import { changePopupBox } from "../actionCreators";
import { changeLocation } from "../../header/actionCreators";
import connect from "react-redux/es/connect/connect";
import {
	myRequest,
	setLocalStorage,
	getLocalStorage
} from "../../../../function";
class Index extends PureComponent {
	state = {
		list: [], //热门城市
		province: [], //所有省份
		city: [], //当前选中省下的城市
		location: null, //当前所在位置
		loadingProvince: true, //加载省份中
		loadingCity: false //加载城市中
	};

	render() {
		// const { userInfo } = this.props; //用户信息
		let { location } = this.state; //当前位置
		let provinceId = location ? location.province.id : 0; //默认省份ID
		let cityId = location ? location.city.id : 0; //默认城市ID
		return (
			<Modal
				higher={400}
				width={680}
				destroyOnClose={true}
				footer={null}
				onCancel={() =>
					this.props.changePopupBox([{ type: this.props.popupType }])
				}
				visible={true}
			>
				<div className="myorientation">
					{/* <!-- 第一部分标题名字 --> */}
					<div className="my_orientation">
						<span className="glyphicon glyphicon-map-marker icon_orientation"></span>
						<span className="my_userorientaion">我的位置:</span>
						<Radio.Group
							className="provinces"
							value={cityId}
							onChange={e => this.selectCity(e)}
						>
							<Radio.Button
								value={this.props.myLocation.getIn(["city", "id"])}
								data={this.props.myLocation.getIn(["city", "name"])}
								style={{ color: "#333" }}
							>
								{this.props.myLocation.getIn(["city", "name"])}
							</Radio.Button>
						</Radio.Group>
					</div>
					{/* <!-- 第二部分热门城市 --> */}
					<div className="mycitys">
						<span className="glyphicon glyphicon-tree-deciduous re_city"></span>
						<span className="reciyt">热门城市:</span>
						<Radio.Group
							style={{ margin: "0px 0px 20px 118px" }}
							onChange={e => this.selectCity(e)}
							value={cityId}
						>
							{this.state.list.map((item, index) => (
								<div
									style={{
										float: "left",
										marginRight: (index + 1) % 4 === 0 ? 0 : 27
									}}
								>
									<Radio.Button
										key={item.id}
										value={item.id}
										data={item.name}
										style={{ color: "#333" }}
									>
										{item.name}
									</Radio.Button>
								</div>
							))}
						</Radio.Group>
					</div>
					{/* <!-- 第三部分省份 --> */}
					<div className="province">
						<span className="glyphicon glyphicon-flag glyphicon_flag"></span>
						<span className="mypro">省份:</span>
						{/* <Spin tip="加载中..." > */}
						<Radio.Group
							defaultChecked={false}
							onChange={e => this.selectProvince(e)}
							value={provinceId}
							style={{ margin: "-18px 0px 0px 118px", float: "left" }}
						>
							{this.state.province.map((item, index) => (
								<div
									style={{
										float: "left",
										marginRight: (index + 1) % 6 === 0 ? 0 : 27,
										marginBottom: "15px"
									}}
								>
									<Radio.Button
										key={item.id}
										value={item.id}
										data={item.name}
										style={{ color: "#333" }}
									>
										{item.name}
									</Radio.Button>
								</div>
							))}
						</Radio.Group>
						{/* </Spin> */}
						<div style={{ clear: "both" }}></div>
					</div>
					<div style={{ clear: "both" }}></div>
					{/* <!-- 选择省份下的城市 --> */}
					<span className="glyphicon glyphicon-flag glyphicon_flags"></span>
					<p className="mypro2">城市:</p>
					{/* <Spin tip="加载中..." > */}
					<Radio.Group
						onChange={e => this.selectCity(e)}
						value={cityId}
						style={{ margin: "0px 0px 0px 118px", float: "left" }}
					>
						{this.state.city.map((item, index) => (
							<div
								style={{
									float: "left",
									marginBottom: 9,
									marginRight: (index + 1) % 6 === 0 ? 0 : 27
								}}
							>
								<Radio.Button
									key={item.id}
									value={item.id}
									data={item.name}
									style={{ color: "#333" }}
								>
									{item.name}
								</Radio.Button>
							</div>
						))}
					</Radio.Group>
					{/* </Spin> */}
					<div style={{ clear: "both" }}></div>
				</div>
				<div style={{ clear: "both" }}></div>
			</Modal>
		);
	}

	//获取热门城市
	getHotlist() {
		let that = this;
		myRequest({
			method: "get",
			path: "/common/location/hot_city",
			callback: function(response) {
				// console.log(response);
				if (response.data.code === 0) {
					that.setState({
						list: response.data.data
					});
				}
			}
		});
	}

	//获取所有省份
	getProvince() {
		let that = this;
		//获取网站名称
		myRequest({
			method: "get",
			path: "/common/location/next_level_area",
			params: {
				parent_id: 1
			},
			callback: function(response) {
				// console.log(response);
				//处理返回结果
				if (response.data.code === 0) {
					that.setState({
						province: response.data.data,
						loadingProvince: false
					});
				}
			}
		});
	}

	// 获取省份下的城市
	getCity(province) {
		let that = this;
		myRequest({
			method: "get",
			path: "/common/location/next_level_area",
			params: {
				parent_id: province
			},
			callback: function(response) {
				// console.log(response);
				//处理返回结果
				if (response.data.code === 0) {
					that.setState({
						city: response.data.data,
						loadingCity: false
					});
				}
			}
		});
	}
	//选择省份
	selectProvince(e) {
		//当前位置
		let location = this.state.location;
		if (location.province.id !== e.target.value) {
			//改变省份
			location.province = {
				id: e.target.value,
				name: e.target.data
			};
			this.setState({ location }, () => this.getCity(e.target.value));
		}
	}

	//选择城市
	selectCity(e) {
		console.log(e);
		//当前位置
		let location = this.state.location;
		//改变城市
		location.city = {
			id: e.target.value,
			name: e.target.data
		};
		console.log(location);
		this.setState(
			() => ({ location }),
			() => {
				//储存所选的城市
				setLocalStorage("location", location);
				//修改当前位置
				this.props.changeLocation(location);
				//关闭地区选择框
				this.props.changePopupBox([{ type: "location" }]);
			}
		);
	}
	//初始化选择的地区
	initArea() {
		let location = getLocalStorage("location");
		if (location) {
			this.setState({ location }, () => {
				this.getCity(location.province.id);
			});
		}
	}

	// 挂载组件
	componentDidMount() {
		this.getHotlist(); // 热门城市
		this.getProvince(); // 获取所有的省份
		this.initArea(); // 初始化自己的选取
	}
}
const mapState = state => {
	return {
		userInfo: state.getIn(["header", "userInfo"]), //用户信息
		locations: state.getIn(["header", "location"]), //当前位置
		myLocation: state.getIn(["header", "mylocation"]) //我的位置
	};
};
const mapDispath = dispath => {
	return {
		//改变弹出框状态
		changePopupBox(info) {
			dispath(changePopupBox(info));
		},
		//修改当前位置
		changeLocation(value) {
			dispath(changeLocation(value));
		}
	};
};

//数据仓库
Index = connect(mapState, mapDispath)(Index);

export default Index;
