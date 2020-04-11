import React, {PureComponent} from "react";
import "./index.css";
import {Modal} from "antd";
import {changePopupBox} from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import {Form, DatePicker, TimePicker, Input, Button} from "antd";

const {TextArea} = Input;
const dateFormat = "YYYY/MM/DD";

class Index extends PureComponent {
  render() {
    return (
        <Modal
            width={450}
            style={{marginTop: "120px"}}
            destroyOnClose={true}
            footer={null}
            onCancel={() =>
                this.props.changePopupBox([{type: this.props.popupType}])
            }
            visible={true}
        >
          <h2
              style={{color: "#6b76ff", fontWeight: "bold", textAlign: "center"}}
          >
            修改预约
          </h2>
          <Form labelCol={{span: 5}} wrapperCol={{span: 25}}>
            <Form.Item>
              <labelCol style={{color: "#666", marginRight: 15}}>
                时间:
              </labelCol>
              <DatePicker format={dateFormat} style={{width: 190}}/>
              <TimePicker
                  defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                  style={{width: 130, marginLeft: "20px"}}
              />
            </Form.Item>
            <Form.Item>
              <labelCol
                  style={{
                    color: "#666",
                    marginRight: 15,
                    marginTop: -1,
                    float: "left"
                  }}
              >
                地点:
              </labelCol>
              <TextArea
                  placeholder="请输入地点"
                  style={{resize: "none", width: "340px"}}
                  rows={2}
              />
            </Form.Item>
            <Button
                type="primary"
                size="small"
                htmlType="submit"
                style={{
                  backgroundColor: "#0192fe",
                  color: "#fff",
                  width: "70px",
                  marginLeft: "140px"
                }}
            >
              确定
            </Button>
            <Button
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
            <div style={{float: "left"}}></div>
          </Form>
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
Index = connect(null, mapDispath)(Form.create()(Index));

export default Index;
