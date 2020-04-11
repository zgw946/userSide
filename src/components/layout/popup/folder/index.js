import React, {PureComponent} from 'react';
import './index.css';
import {Modal} from "antd";
import {changePopupBox} from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import {Icon, Button} from 'antd';

class Index extends PureComponent {

  render() {

    return (
        <Modal
            width={600}
            style={{padding: "20px", marginTop: "120px"}}
            destroyOnClose={true}
            footer={null}
            onCancel={() => this.props.changePopupBox([{type: this.props.popupType}])}
            visible={true}
        >
          <Icon type="plus" onClick={() => this.props.changePopupBox([{type: "dynamicFile"}])}/>
          <div style={{padding: "17px 6px"}}>
            <div className="folder_gc">
              <div className="my_folderText" style={{float: "left"}}>
                <Icon style={{fontSize: "40px"}} type="file-text" theme="twoTone"/>
              </div>
              {/* 信息 */}
              <div style={{float: "left", marginTop: "8px", marginLeft: "20px"}}>
                <p>
                  <span>这个工程有很大的问题</span>
                  <span style={{marginLeft: "60px", color: "666", fontSize: "12px"}}>更新:</span>
                  <span style={{marginLeft: "10px", color: "666", fontSize: "12px"}}>2019年12月6日</span>
                </p>
                <p>
                  <span style={{color: "#ccc"}}>类型:</span>
                  <span style={{marginLeft: "10px"}}>工程纠纷</span>
                  <Button size="small" style={{backgroundColor: "#ff5858", color: "#fff", float: "right"}}>结案</Button>
                </p>
              </div>
              <Icon type="more" style={{float: "right", marginTop: "25px", fontSize: "30px", fontWeight: "bold"}}/>
              <div style={{clear: "both"}}></div>
            </div>
            <div style={{clear: "both"}}></div>
            {/* 我的第二个案件 */}
            <div className="folder_gc">
              <div className="my_folderText" style={{float: "left"}}>
                <Icon style={{fontSize: "40px"}} type="file-text" theme="twoTone"/>
              </div>
              {/* 信息 */}
              <div style={{float: "left", marginTop: "8px", marginLeft: "20px"}}>
                <p>
                  <span>我要离婚</span>
                  <span style={{marginLeft: "143px", color: "666", fontSize: "12px"}}>更新:</span>
                  <span style={{marginLeft: "10px", color: "666", fontSize: "12px"}}>2019年12月6日</span>
                </p>
                <p>
                  <span style={{color: "#ccc"}}>类型:</span>
                  <span style={{marginLeft: "10px"}}>离婚</span>
                  <Button size="small" style={{backgroundColor: "#4586ff", color: "#fff", float: "right"}}>一审</Button>
                </p>
              </div>
              <Icon type="more" style={{float: "right", marginTop: "25px", fontSize: "30px", fontWeight: "bold"}}/>
              <div style={{clear: "both"}}></div>
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