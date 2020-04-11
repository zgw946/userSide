import React, {PureComponent} from 'react';
import './index.css';
import {Modal, Form, Select, Input, Icon, Button} from "antd";
import {changePopupBox} from "../actionCreators";
import connect from "react-redux/es/connect/connect";

const {Option} = Select;
const {TextArea} = Input;

//修改头像
class Index extends PureComponent {

  render() {
    return (
        <Modal
            width={500}
            destroyOnClose={true}
            footer={null}
            onCancel={() => this.props.changePopupBox([{type: this.props.popupType}])}
            visible={true}
        >
          <div className="newlys">
            <p className="xz_newlys">新增</p>
            <div>
              <span className="ax_newlys">案件名称:</span>
              <Input style={{marginTop: "20px"}} placeholder="请输入案件名称"/>
              <span className="axlx_newlys">案件类型:</span>
              <Form.Item style={{marginTop: "34px"}}>
                <Select defaultValue="1" style={{width: "452px"}}>
                  <Option value="1">请选择案件类型</Option>
                  <Option value="2">民事纠纷</Option>
                  <Option value="3">刑事诉讼</Option>
                </Select>
              </Form.Item>
              <span className="lx_newlys">案件材料:</span>
              <Icon className="addIcon" type="plus"/>
              <div className="uploadfile">
                <span className="cailiao">材料：</span>
                <span className="files">xxx.jpg (xxx照片)</span>
                <Icon className="deleteIcon" type="delete"/>
              </div>
            </div>
            <div>
              {/* 描述 */}
              <span className="ms_newlys">案件描述:</span>
              <TextArea placeholder="请输入案件的具体描述" className="mytextAreas" rows={5}/>
              <span className="ms_num">0/1000</span>
              <Button className="sends" style={{
                backgroundColor: "#2e3341",
                color: "#FFF",
                borderRadius: "4px",
                height: "26px",
                width: "80px"
              }}>提交</Button>
            </div>
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