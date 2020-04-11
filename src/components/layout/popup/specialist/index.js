import React, {PureComponent} from 'react';
import './index.css';
import {Modal} from "antd";
import {changePopupBox} from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import {Button} from 'antd';

class Index extends PureComponent {

  render() {

    return (
        <Modal
            width={300}
            style={{padding: "20px"}}
            destroyOnClose={true}
            footer={null}
            onCancel={() => this.props.changePopupBox([{type: this.props.popupType}])}
            visible={true}
        >
          <div style={{padding: "50px 35px", height: "180px"}}>
          <span style={{color: "#333", fontWeight: "bold"}}>
            进行专家咨询前请仔细阅读并
          </span>
            <span style={{color: "#333", fontWeight: "bold", marginLeft: "42px"}}>同意以下协议：</span>
            <p style={{color: "#6b76ff", marginLeft: "10px", marginTop: "10px"}}>《仁法网专家咨询协议》</p>
            <Button size="small" style={{backgroundColor: "#6b76ff", color: "#fff", width: "195px"}}>我同意</Button>
          </div>

        </Modal>
    );
  }
}

const mapDispath = (dispath) => {
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