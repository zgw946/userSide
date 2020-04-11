import React, {Component} from "react";
import "./index.css";
import {changePopupBox} from "../../../../components/layout/popup/actionCreators";
import connect from "react-redux/lib/connect/connect";
import {Icon, Input, Popover, Upload, message, Badge} from "antd";

const content = (
    <div className="myemojis">
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
      <Icon className="emojis" type="meh" theme="twoTone"/>
    </div>
);
// 文件上传
const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

class Index extends Component {
  render() {
    return (
        <div className="wires">
          {/* 表情包 */}
          <div
              style={{
                float: "left",
                width: "14px",
                marginLeft: "10px"
              }}
          >
            <Popover content={content} trigger="focus">
              <button className="emoji">
                <Icon type="smile"/>
              </button>
            </Popover>
          </div>
          {/* 上传文件夹 */}
          <div
              style={{
                float: "left",
                width: "14px",
                marginLeft: "10px"
              }}
          >
            <Icon
                onClick={() => this.props.changePopupBox([{type: "folder"}])}
                type="folder"
            />
          </div>
          {/* 上传文件夹 */}
          <div
              style={{
                float: "left",
                width: "14px",
                marginLeft: "10px"
              }}
          >
            <Upload {...props}>
              <Icon type="file-text"/>
            </Upload>
          </div>
          {/* 预约 */}
          <div
              style={{
                float: "left",
                width: "14px",
                marginLeft: "10px"
              }}
          >
            <Badge dot>
              <Icon
                  type="dashboard"
                  onClick={() =>
                      this.props.changePopupBox([{type: "appointment"}])
                  }
              />
            </Badge>
          </div>
          {/* 聊天输入框 */}
          <Input.TextArea
              rows={5}
              className="dopes mt5"
              placeholder="请输入相关内容"
          ></Input.TextArea>
        </div>
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

Index = connect(null, mapDispath)(Index);

export default Index;
