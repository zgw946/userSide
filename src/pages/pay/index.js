import React, {Component, Fragment} from "react";
import "./index.css";
import {Tabs, Button} from "antd";

const {TabPane} = Tabs;

// 订单
class Index extends Component {
  render() {
    return (
        <Fragment>
          <div className="order">
            <div className="myOrder">
              <h2
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    fontWeight: "bold",
                    marginBottom: "40px"
                  }}
              >
                确认订单
              </h2>
              <span style={{fontSize: "14px", color: "#333"}}>订单编号：</span>
              <span style={{fontSize: "14px", color: "#333"}}>D1245565644</span>
              <span
                  style={{
                    fontSize: "14px",
                    color: "#4586ff",
                    float: "right",
                    fontWeight: "bold"
                  }}
              >
							：￥188.00
						</span>
              <span style={{fontSize: "14px", color: "#333", float: "right"}}>
							应付金额
						</span>
              <div style={{clear: "both"}}></div>
              <br></br>
              <div style={{clear: "both"}}></div>
              <span
                  style={{fontSize: "14px", color: "#333", marginTop: "15px"}}
              >
							订单内容：
						</span>
              <span style={{fontSize: "14px", color: "#333"}}>专家问诊</span>
              <Tabs defaultActiveKey="1">
                <TabPane tab="余额支付" key="1">
								<span style={{fontSize: "14px", color: "#333"}}>
									我的余额：
								</span>
                  <span
                      style={{
                        fontSize: "14px",
                        color: "#4586ff",
                        marginLeft: "15px"
                      }}
                  >
									￥1888888.00
								</span>
                  <span
                      style={{
                        fontSize: "14px",
                        color: "#4586ff",
                        float: "right",
                        fontWeight: "bold"
                      }}
                  >
									￥188.00
								</span>
                  <span
                      style={{fontSize: "14px", color: "#333", float: "right"}}
                  >
									应付金额：
								</span>
                  <div className="law_explain">
                    按下「立即付費」，即表示我接受服务条款、协同
                    使用者协议、隐私与Cookie政策、
                    以及这里所述的适用声明。我也了解可能接受
                    人仁法网使用者授权协议 ，才能存取我的购买項目。
                  </div>
                  <Button
                      size="small"
                      style={{
                        backgroundColor: "#2e3341",
                        color: "#fff",
                        float: "right",
                        marginTop: "20px"
                      }}
                  >
                    立即支付
                  </Button>
                </TabPane>
                <TabPane tab="微信支付" key="2">
                  <div className="weChatPay ">
                    <img src={require("../../statics/images/wx.png")} alt=""/>
                    <h2
                        style={{
                          fontSize: "16px",
                          color: "#666666",
                          marginTop: "10px"
                        }}
                    >
                      打开微信扫二维码进行支付
                    </h2>
                    <p>
                      进行 [扫描支付]，即表示我接受服务条款、协同
                      使用者协议、隐私与Cookie政策、
                      以及这里所述的适用声明。我也了解可能接受
                      人仁法网使用者授权协议 ，才能存取我的购买項目。
                    </p>
                  </div>
                </TabPane>
                <TabPane tab="支付宝支付" key="3">
                  <div className="weChatPay ">
                    <img src={require("../../statics/images/wx.png")} alt=""/>
                    <h2
                        style={{
                          fontSize: "16px",
                          color: "#666666",
                          marginTop: "10px"
                        }}
                    >
                      打开支付宝扫二维码进行支付
                    </h2>
                    <p>
                      进行 [扫描支付]，即表示我接受服务条款、协同
                      使用者协议、隐私与Cookie政策、
                      以及这里所述的适用声明。我也了解可能接受
                      人仁法网使用者授权协议 ，才能存取我的购买項目。
                    </p>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Fragment>
    );
  }
}

export default Index;
