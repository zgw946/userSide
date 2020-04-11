import React, {PureComponent} from "react";
import "./index.css";
import {Modal} from "antd";
import {changePopupBox} from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import {Icon, Button, Popover, Divider} from "antd";

class Index extends PureComponent {
  state = {
    list: [
      {
        id: 1
      },
      {
        id: 2
      }
    ]
  };

  render() {
    const content = (
        <div>
          <p
              onClick={() => this.props.changePopupBox([{type: "modification"}])}
              style={{margin: "0px"}}
          >
            修改预约
          </p>
          <Divider style={{margin: "5px 0px"}}/>
          <p style={{margin: "0px"}}>取消预约</p>
        </div>
    );
    return (
        <Modal
            width={600}
            style={{padding: "20px", marginTop: "120px"}}
            destroyOnClose={true}
            footer={null}
            onCancel={() =>
                this.props.changePopupBox([{type: this.props.popupType}])
            }
            visible={true}
        >
          {/* <Icon
					type="plus"
					onClick={() => this.props.changePopupBox([{ type: "dynamicFile" }])}
				/> */}
          <span
              onClick={() => this.props.changePopupBox([{type: "publiCmake"}])}
              style={{color: "#6b76ff"}}
          >
					发布
				</span>
          <div style={{padding: "17px 6px"}}>
            {this.state.list.map(item => (
                <div className="appointment_gc" key={item.id}>
                  <div className="my_folderText" style={{float: "left"}}>
                    <Icon
                        type="dashboard"
                        theme="twoTone"
                        style={{fontSize: "40px"}}
                    />
                  </div>
                  {/* 信息 */}
                  <div
                      style={{float: "left", marginTop: "8px", marginLeft: "20px"}}
                  >
                    {/* 时间 */}
                    <p>
                      <span style={{color: "#ccc"}}>时间:</span>
                      <span
                          style={{
                            marginLeft: "10px",
                            color: "666",
                            fontSize: "12px"
                          }}
                      >
										2019年12月6日14:00
									</span>
                    </p>
                    {/* 类型 */}
                    <p>
                      <span style={{color: "#ccc"}}>类型:</span>
                      <span style={{marginLeft: "10px"}}>广东法仁律师事务所</span>
                    </p>
                  </div>
                  {/* 预约 */}
                  <div style={{float: "right"}}>
                    {item.id === 1 ? (
                        <Button
                            size="small"
                            style={{
                              marginTop: "27px",
                              backgroundColor: "#a6adff",
                              color: "#fff"
                            }}
                        >
                          预约成功
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            style={{
                              marginTop: "27px",
                              backgroundColor: "#ccc",
                              color: "#fff"
                            }}
                        >
                          等待确认
                        </Button>
                    )}

                    <Popover placement="bottom" content={content} trigger="click">
                      <Icon
                          type="more"
                          style={{
                            float: "right",
                            marginTop: "25px",
                            fontSize: "30px",
                            fontWeight: "bold"
                          }}
                      />
                    </Popover>
                  </div>
                  <div style={{clear: "both"}}></div>
                </div>
            ))}

            <div style={{clear: "both"}}></div>
            {/* 我的第二个案件 */}
          </div>
        </Modal>
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

//数据仓库
Index = connect(null, mapDispath)(Index);

export default Index;
