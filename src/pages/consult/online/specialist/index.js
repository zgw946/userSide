import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import "./index.css";
import {Button, Avatar} from "antd";
import InputField from "../inputField/index"; //聊天框输入
class Index extends Component {
  state = {
    list: [
      {
        id: 1,
        btn: "立即支付",
        type: "等待支付"
      },
      {
        id: 2,
        btn2: "进入咨询",
        type: "进行中..."
      }
    ],
    alters: true // 切换聊天状态
  };

  render() {
    return (
        <Fragment>
          <div className="hangs">
            <p className="p_hangs">专家咨询</p>
          </div>
          <div className="mycontent">
            {this.state.alters ? (
              <div>
                {this.state.list.map(item => (
                  <div className="expert_consult" key={item.id}>
                    {/* 左边部分 */}
                    <div style={{float: "left"}}>
									<span
                    style={{
                      fontSize: "18px",
                      color: "#333"
                    }}
                  >
										专家咨询-离婚
									</span>
                      <br/>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#999"
                        }}
                      >
										咨询律师:
									</span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#333",
                          margin: "10px"
                        }}
                      >
										超级律师
									</span>
                      <br/>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#999"
                        }}
                      >
										咨询时间:
									</span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#333",
                          margin: "10px"
                        }}
                      >
										2019年12月25日
									</span>
                    </div>
                    {/* 右边部分 */}
                    <div style={{float: "right"}}>
									<span
                    style={{
                      fontSize: "14px",
                      color: "#999",
                      marginRight: 10
                    }}
                  >
										咨询:
									</span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6B76FF",
                          marginRight: 15
                        }}
                      >
										{item.type}
									</span>
                      <br/>
                      {item.btn ? (
                        // 立即支付
                        <Link to="/pay">
                          <Button
                            size="small"
                            style={{
                              backgroundColor: "#6b76ff",
                              color: "#fff",
                              margin: "13px 0px 0px 24px"
                            }}
                          >
                            {item.btn}
                          </Button>
                        </Link>
                      ) : (
                        // 进入咨询
                        <Button
                          onClick={() => this.btnClick()}
                          size="small"
                          style={{
                            backgroundColor: "#6b76ff",
                            color: "#fff",
                            margin: "13px 0px 0px 24px"
                          }}
                        >
                          {item.btn2}
                        </Button>
                      )}
                    </div>
                    <div style={{clear: "both"}}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {/* 专家咨询聊天对话 */}
                <div className="my_counselor">
                  {/* 我的回答 */}
                  <div className="counselor_answers">
                    <img
                      src={require("../../../../statics/images/聊天界面/avatar_robot.png")}
                      className="counselor_robot2"
                      alt=""
                    />
                    <div className="counselor_blerk2">
									<span style={{color: "#333"}}>
										您好，请问我能为您做些什么？
									</span>
                    </div>
                  </div>
                  <div style={{clear: "both"}}></div>
                  {/* 用户的咨询 */}
                  <div className="counselor_consults">
                    <Avatar
                      shape="square"
                      icon="user"
                      style={{float: "right", marginRight: "15px"}}
                    />
                    <div className="userCounselor">
                      <span>你好张专家我想咨询下刑事方面的案件</span>
                    </div>
                  </div>
                  <div style={{clear: "both"}}></div>
                </div>
                {/* 聊天框输入组件 */}
                <div className="inputBase">
                  <InputField/>
                </div>
              </div>
            )}
          </div>
        </Fragment>
    );
  }

  btnClick() {
    this.setState({
      alters: false
    });
  }
}

export default Index;
