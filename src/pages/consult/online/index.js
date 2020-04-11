import React, {Component, Fragment} from "react";
import "./index.css";
import {Avatar, Badge, Empty, Input} from "antd";
import connect from "react-redux/lib/connect/connect";
import {changePopupBox} from "../../../components/layout/popup/actionCreators";
import Counselor from "./counselor"; //法律顾问
import Attorney from "./attorney"; //律师对话
import Specialist from "./specialist"; //专家咨询
import System from "./system"; //系统消息
import moment from "moment";
import {myRequest} from "../../../function"; //聊天框输入

//设置日期输出格式
moment.locale('zh-cn', {
  calendar : {
    sameDay: 'HH:mm',
    nextDay: '[明天] HH:mm',
    nextWeek: '[下个]dddd HH:mm',
    lastDay: '[昨天] HH:mm',
    lastWeek: '[上个]dddd HH:mm',
    sameElse: 'YYYY年MM月DD日 HH:mm'
  }
});

//会话页面
class Index extends Component {
  state = {
    selected: 0,//选择的ID
    type :0,//选中的类型
    object :null,//选中的对象
    conversations: [] // 会话列表
  };

  //获取会话列表
  getConversationList() {
    let that = this;
    myRequest({
      method: "get",
      path: "/consultant/conversation/index",
      auth: true,
      callback: function (response) {
        if (response.data.code === 0) {
          that.setState({
            conversations: response.data.data
          });
        }
      }
    });
  }

  //选择会话
  selectConversation(id,type,object) {

    this.setState({
      selected: id,
      type,
      object
    },() => this.getConversationList());
  }

  componentDidMount() {
    this.getConversationList();

    //设置定时拉取会话列表
    const interval = setInterval(() => this.getConversationList(),5000);
    this.setState({
      interval
    });
  }

  componentWillUnmount(){
    window.clearInterval(this.state.interval);
  }

  render() {

    return (
        <Fragment>
          <div className="homes">
            <div className="chat_Consultings">
              {/* {左边部分} */}
              <div className="chats">
                <Input.Search className="w95p mt5 ml5" placeholder="搜索" allowClear />
                {this.state.conversations.map(item => (
                  <div
                    key={item.id}
                    className={this.state.selected === item.id ? "counselor " : "btnnum counselor_hover"}
                    onClick={() => this.selectConversation(item.id,item.type,item.object)}
                  >
                    <Badge count={item.new_num} className="mt16 ml2">
                      {(() => {
                        switch (item.type) {
                          case 1://律师咨询
                            return (
                              <Avatar src={item.object.head_img} shape="square" icon="user"/>
                            );
                          case 2://专家咨询
                            return (
                              <Avatar shape="square" icon="team"/>
                            );
                          case 3:
                            return (
                              <Avatar shape="square" icon="robot"/>
                            );
                          case 4:
                            return (
                              <Avatar shape="square" icon="message"/>
                            );
                          default:
                            break;
                        }
                      })()}
                    </Badge>
                    <span className="span_counselor">{item.object.name+(item.type === 1 ? "律师" : "")}</span>
                    {
                      item.last_content ? (
                        <Fragment>
                          <span className="time_counselor">
                            {moment(item.last_content_time).calendar()}
                          </span>
                          <p className="p_counselor">{item.last_content}</p>
                        </Fragment>
                      ) : null
                    }
                  </div>
                ))}
              </div>
              <div className="windows">
                {(() => {
                  switch (this.state.type) {
                    case 1: // 律师对话
                      return <Attorney conversationId={this.state.selected} conversationObj={this.state.object}/>;
                    case 2: //专家咨询
                      return <Specialist/>;
                    case 3: //法律顾问
                      return <Counselor/>;
                    case 4: //系统消息
                      return <System/>;
                    default://默认为空
                      return <Empty/>;
                  }
                })()}
              </div>
            </div>
          </div>
        </Fragment>
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
