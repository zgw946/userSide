import React, {Component, Fragment} from "react";
import "./index.css";
import {Avatar, Icon, message, Popover, Upload, Input, Divider, Form, Button, Badge} from "antd";
import {changePopupBox} from "../../../../components/layout/popup/actionCreators";
import connect from "react-redux/lib/connect/connect";
import {computationType, getFileSize, getLocalStorage, myRequest} from "../../../../function";
import ReconnectingWebSocket from "reconnecting-websocket";
import {DOMAIN,ONLY_DOMAIN} from "../../../../constant";
import moment from "moment";

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

//律师咨询聊天组件
class Index extends Component {
  state = {
    list : [],//会话详情容器
    page : 1,//当前显示页数
    pageSize : 20,//每页显示数据数量
    totalPage : 0,//数据总页数
    rws : null,//即时通讯长连接
    message : "",//输入框内容
    conversationId : 0,//会话ID
    conversationObj:null,//会话对象
  };

  //修改显示数量
  getMore(){
    this.setState({
      pageSize : this.state.pageSize + 20
    },() => this.getLawyerDetail());
  }

  //获取会话内容
  getLawyerDetail(){
    let that = this;
    const conversationId = this.state.conversationId;

    myRequest({
      method: "get",
      path: "/consultant/conversation/lawyer/"+conversationId,
      params:{
        page : that.state.page,
        page_size : that.state.pageSize
      },
      auth: true,
      callback: function (response) {
        if (response.data.code === 0) {
          let originalList = [];
          if(response.data.data.list){
            originalList = response.data.data.list.reverse()
          }

          let list = [];//最新的本地数据

          //划分时间段（每分钟为一个区间）
          originalList.map((item) => {
            let key = moment(item.created, "YYYY-MM-DD hh:mm").calendar();

            //判断数组是否存在
            if(!list[key]){
              list[key] = [];
            }

            list[key].push(item);

            return null;
          });

          that.setState({
            list,
            totalPage : response.data.data.total_page
          },()=>{
            //首次获取内容时跳到最新的消息
            if(that.state.pageSize === 20){
              that.contentNode.scrollTop = that.contentNode.scrollHeight;
            }

            //判断会话是否存在
            if(!that.state.rws){
              //获取会话详情后开启正常会话
              that.makeWebSocket();
            }

          });
        }
      }
    });
  }

  //建立websocket
  makeWebSocket(){

    const token = getLocalStorage('api_token');
    const conversationId = this.state.conversationId;

    if (token) {
      let url = "ws://"+ONLY_DOMAIN+"/common/conversation/lawyer/open_conversation?token="+encodeURIComponent(token)+"&id="+conversationId;
      // 建立websocket 连接
      let rws = new ReconnectingWebSocket(url);

      //开启时将连接赋值到state中去
      rws.addEventListener("open", () => {
        this.setState({
          rws
        });
      });

      rws.addEventListener("message", e => {
        if (e.data) {
          const newMessage = JSON.parse(e.data);
          this.addList(newMessage);
        }
      });

      // 错误时进行的处理
      rws.addEventListener("error", e => {
        message.error("会话连接失败，请重试！")
      });
    }
  }

  //把消息添加进消息列表
  addList(message){
    // 这里是你拿到数据后进行的处理
    //你可以调用action 来触发消息给页面上展示 例如 这些消息方法需要你自己来封装
    let list = this.state.list;

    //划分时间段（每分钟为一个区间）
    let key = moment(message.created, "YYYY-MM-DD hh:mm").calendar();

    //判断数组是否存在
    if(!list[key]){
      list[key] = [];
    }

    list[key].push(message);

    //判断聊天信息框是否滚动到最新消息
    let bottom = false;
    if(this.contentNode.scrollHeight && this.contentNode.scrollTop){
      if((this.contentNode.scrollHeight-this.contentNode.scrollTop) <= 400){
        bottom = true
      }
    }

    this.setState({
      list
    },() => {
      //当消息框不是滚动到最下面时，如果接收到的是自己发送的消息则滚动到最底部
      if(message.member_type === 1 || bottom){
        this.contentNode.scrollTop = this.contentNode.scrollHeight;
      }
    })
  }

  //同步输入框的内容
  syncMessage(e){
    this.setState({
      message : e.target.value.replace(/[\r\n]/g,"")
    })
  }

  //发送文本消息
  sendText(){
    let sendMessgae = this.state.message;//获取文本框中内容

    //输入框有内容时才允许发送
    if(sendMessgae){
      let message ={};
      message.content = sendMessgae;//消息内容
      this.state.rws.send(JSON.stringify(message));
      this.setState({
        message:""
      },() => {
        //模拟消息
        let imitateData ={};
        imitateData.id =  (new Date()).getTime();
        imitateData.type = 1;
        imitateData.member_type = 1;
        imitateData.content = sendMessgae;
        imitateData.created = moment().format("YYYY-MM-DD HH:mm");
        this.addList(imitateData);
      })
    }
  }

  //发送文件
  sendFile(info){
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    if (info.file.status === 'done') {
      let message ={};
      const file = info.file.response.data;
      message.file = {id:file.id};//消息内容
      this.state.rws.send(JSON.stringify(message));

      //模拟消息
      let imitateData ={},imitateFile={};

      //设置文件信息
      imitateFile.id =file.id;
      imitateFile.type =file.type;
      imitateFile.url =file.url;
      imitateFile.original_name = file.original_name;
      imitateFile.size = file.size;

      //设置模拟消息
      imitateData.id =  (new Date()).getTime();
      imitateData.member_type = 1;
      imitateData.file = imitateFile;
      imitateData.created = moment().format("YYYY-MM-DD HH:mm");
      this.addList(imitateData);

    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }

  //初始化组件
  componentDidMount() {
    this.setState({
      conversationId:this.props.conversationId,
      conversationObj:this.props.conversationObj
    },() => this.getLawyerDetail());
  }

  componentWillReceiveProps(props){
    this.setState({
      conversationId:props.conversationId,
      conversationObj:props.conversationObj
    },() => this.getLawyerDetail());
  }

  componentWillUnmount() {

    //判断会话是否开启
    if(this.state.rws) {
      //获取会话详情后开启正常会话
      this.state.rws.close();
    }

  }


  render() {
    const {list,conversationObj,totalPage} = this.state;
    console.log(conversationObj)

    return (
      <Fragment>
        <div className="hangs">
          <p className="p_hangs">{conversationObj ? conversationObj.name+"律师" : ""}</p>
        </div>
        <div className="mycontent">
          <div ref={ node => this.contentNode = node } className="my_counselor">
            {
              //判断是否已展示全部消息
              totalPage <= 1 ? null : (
                <Button onClick={() => this.getMore()} style={{marginLeft:287}} type="link">查看更多记录</Button>
              )
            }
            {
              Object.keys(list).map((time) => {

                const item = list[time];

                return (
                  <div key={time} className="message_box">
                    <p className="tac f12px">{time}</p>
                    {
                      item.map(itemChild => (
                        <Fragment key={itemChild.id}>
                          {
                            itemChild.member_type === 1 ? (
                              <Avatar
                                src={this.props.userInfo.head_img}
                                size={40}
                                shape="square"
                                icon="user"
                                className="message_head rf"
                              />
                            ) : (
                              <Avatar
                                src={conversationObj? conversationObj.head_img:""}
                                size={40}
                                shape="square"
                                icon="user"
                                className="message_head lf"
                              />
                            )
                          }
                          <div className={"message_content " + (itemChild.member_type === 1 ? "rf mr26" : "lf ml25")}>
                            {
                              itemChild.type === 1 ? (
                                <span style={{color: "#333"}}>{itemChild.content}</span>
                              ) : (
                                <div>
                                  {/* 音乐视频 */}
                                  <div style={{float: "left", margin: "8px 5px 5px 10px"}}>
                                    {(() => {
                                      const file = itemChild.file;
                                      const fileType = file.type.replace(".", "");
                                      const type = computationType(fileType);//计算类型
                                      let cover = '';//封面
                                      switch (type) {
                                        case 'image':
                                          cover = file.url;

                                          break;
                                        case 'word':
                                          cover = require('../../../../statics/images/word.png');

                                          break;
                                        case 'text':
                                          cover = require('../../../../statics/images/text.png');

                                          break;
                                        case 'excel':
                                          cover = require('../../../../statics/images/excel.png');

                                          break;
                                        case 'ppt':
                                          cover = require('../../../../statics/images/ppt.png');

                                          break;
                                        case 'pdf':
                                          cover = require('../../../../statics/images/pdf.png');

                                          break;
                                        case 'packet':
                                          cover = require('../../../../statics/images/yasuobao.png');

                                          break;
                                        default:
                                          cover = require('../../../../statics/images/weizhiwenjian.png');

                                          break;
                                      }

                                      return <Avatar shape="square" size={42} src={cover}/>
                                    })()}
                                  </div>
                                  {/* 详细说明 */}
                                  <div style={{float: "right", margin: "8px 10px 5px 0px"}}>
                                  <span className="counselor_file_name">
                                    {itemChild.file.original_name}
                                  </span>
                                    <span style={{
                                      color: "#ccc",
                                      fontSize: "12px"
                                    }}>{getFileSize(itemChild.file.size)}</span>
                                  </div>
                                  {/* 保存区域 */}
                                  <Divider style={{marginBottom: "0px"}}/>
                                  <div>
                                  <span style={{
                                    color: "#4586ff",
                                    float: "right",
                                    fontSize: "12px",
                                    marginRight: "8px"
                                  }}>下载</span>
                                    <span style={{
                                      color: "#4586ff",
                                      float: "right",
                                      fontSize: "12px",
                                      marginRight: "8px"
                                    }}>打开</span>
                                  </div>
                                </div>
                              )
                            }
                          </div>

                          <div className="clearfix"></div>
                        </Fragment>
                      ))

                    }
                  </div>
                )
              })
            }
            {/*/!* 我的回答 *!/*/}
            {/*<div className="counselor_answers">*/}
            {/*<img*/}
            {/*src={require("../../../statics/images/聊天界面/avatar_robot.png")}*/}
            {/*className="counselor_robot2"*/}
            {/*alt=""*/}
            {/*/>*/}
            {/*<div className="counselor_blerk2">*/}
            {/*<span style={{color: "#333"}}>您好，请问我能为您做些什么？</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 用户的咨询 *!/*/}
            {/*<div className="counselor_consults">*/}
            {/*<Avatar*/}
            {/*shape="square"*/}
            {/*icon="user"*/}
            {/*style={{float: "right", marginRight: "15px"}}*/}
            {/*/>*/}
            {/*<div className="userCounselor">*/}
            {/*<span>我有问题想咨询</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 用户的第二条提问 *!/*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*<div className="counselor_consults">*/}
            {/*<Avatar*/}
            {/*shape="square"*/}
            {/*icon="user"*/}
            {/*style={{float: "right", marginRight: "15px"}}*/}
            {/*/>*/}
            {/*<div className="userCounselor">*/}
            {/*<span>我想查看案件</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 我的第二个回复 *!/*/}
            {/*<div className="counselor_answers">*/}
            {/*<img*/}
            {/*src={require("../../../statics/images/聊天界面/avatar_robot.png")}*/}
            {/*className="counselor_robot"*/}
            {/*alt=""*/}
            {/*/>*/}
            {/*<div className="counselor_blerk">*/}
            {/*<span style={{color: "#333"}}>您在仁法的所有案件：</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*fontSize: "14px",*/}
            {/*fontWeight: "bold"*/}
            {/*}}*/}
            {/*>*/}
            {/*1、工程纠纷(蔡律师)*/}
            {/*</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*fontSize: "14px",*/}
            {/*fontWeight: "bold"*/}
            {/*}}*/}
            {/*>*/}
            {/*2、经济纠纷(张律师)*/}
            {/*</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*color: "#6B76FF",*/}
            {/*fontWeight: "bold",*/}
            {/*fontSize: "12px"*/}
            {/*}}*/}
            {/*>*/}
            {/*我又遇到了法律问题&nbsp;&nbsp;&nbsp;&nbsp; 我有其他事情*/}
            {/*</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 我的第三条提问 *!/*/}
            {/*<div className="counselor_consults">*/}
            {/*<Avatar*/}
            {/*shape="square"*/}
            {/*icon="user"*/}
            {/*style={{float: "right", marginRight: "15px"}}*/}
            {/*/>*/}
            {/*<div className="userCounselor">*/}
            {/*<span>查看所有资料</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 我的第三条回复 *!/*/}
            {/*<div className="counselor_answers">*/}
            {/*<img*/}
            {/*src={require("../../../statics/images/聊天界面/avatar_robot.png")}*/}
            {/*className="counselor_robot"*/}
            {/*alt=""*/}
            {/*/>*/}
            {/*<div className="counselor_blerk">*/}
            {/*<span style={{color: "#333"}}>您的所有材料：</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*fontSize: "14px",*/}
            {/*fontWeight: "bold"*/}
            {/*}}*/}
            {/*>*/}
            {/*1.2016558788.jpg*/}
            {/*</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*fontSize: "14px",*/}
            {/*fontWeight: "bold"*/}
            {/*}}*/}
            {/*>*/}
            {/*2.ddsd.mp3（xxx的录音）*/}
            {/*</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*fontSize: "14px",*/}
            {/*fontWeight: "bold"*/}
            {/*}}*/}
            {/*>*/}
            {/*3.ddsd.mp4（视频））*/}
            {/*</span>*/}
            {/*<br></br>*/}
            {/*<span*/}
            {/*style={{*/}
            {/*color: "#6B76FF",*/}
            {/*fontWeight: "bold",*/}
            {/*fontSize: "12px"*/}
            {/*}}*/}
            {/*>*/}
            {/*上传更多&nbsp;&nbsp;&nbsp;&nbsp;我有其他事情*/}
            {/*</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 我的第四条条提问 *!/*/}
            {/*<div className="counselor_consults">*/}
            {/*<Avatar*/}
            {/*shape="square"*/}
            {/*icon="user"*/}
            {/*style={{float: "right", marginRight: "15px"}}*/}
            {/*/>*/}
            {/*<div className="userCounselor">*/}
            {/*<span>我要找专家咨询</span>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*/!* 我的第四条回复 *!/*/}
            {/*<div className="counselor_answers">*/}
            {/*<img*/}
            {/*src={require("../../../statics/images/聊天界面/avatar_robot.png")}*/}
            {/*className="counselor_robot"*/}
            {/*alt=""*/}
            {/*/>*/}
            {/*<div className="counselor_blerk">*/}
            {/*<div style={{clear: "both"}}></div>*/}
            {/*<div className="blerk_conten" style={{color: "#333"}}>*/}
            {/*本咨询栏目由平台邀请的资深律师负责专题专案回复，*/}
            {/*令每个提问都可以有充分的深度沟通，*/}
            {/*并以书面法律方案回复为结束标志，*/}
            {/*本栏目实行先收费后服务的咨询模式建议一下情况的客户使用：*/}
            {/*</div>*/}
            {/*/!* 被告 *!/*/}
            {/*<div>*/}
            {/*<span style={{color: "#6b76ff"}}>1.被告:</span>*/}
            {/*<span style={{color: "#333"}}>*/}
            {/*已经收到法院的起诉资料作为被告，想咨询案件的风险、防御策略和应诉方案的；*/}
            {/*</span>*/}
            {/*</div>*/}
            {/*/!* 原告 *!/*/}
            {/*<div>*/}
            {/*<span style={{color: "#6b76ff"}}>2.原告:</span>*/}
            {/*<span style={{color: "#333"}}>*/}
            {/*已经收集了部分资料作为原告，准备起诉到法院前，需要咨询诉前方案给出资料整理建议的；*/}
            {/*</span>*/}
            {/*</div>*/}
            {/*/!* 专项 *!/*/}
            {/*<div>*/}
            {/*<span style={{color: "#6b76ff"}}>3.专项:</span>*/}
            {/*<span style={{color: "#333"}}>*/}
            {/*作为非诉专项咨询，有明确的法律咨询要求的。*/}
            {/*</span>*/}
            {/*</div>*/}
            {/*<Button*/}
            {/*size="small"*/}
            {/*onClick={() =>*/}
            {/*this.props.changePopupBox([{type: "specialist"}])*/}
            {/*}*/}
            {/*style={{*/}
            {/*backgroundColor: "#6B76FF",*/}
            {/*color: "#fff",*/}
            {/*width: "200px",*/}
            {/*marginTop: "10px",*/}
            {/*marginLeft: "10px"*/}
            {/*}}*/}
            {/*>*/}
            {/*立即咨询*/}
            {/*</Button>*/}
            {/*<p*/}
            {/*style={{*/}
            {/*color: "#6B76FF",*/}
            {/*fontSize: "12px",*/}
            {/*float: "right",*/}
            {/*marginTop: "10px"*/}
            {/*}}*/}
            {/*>*/}
            {/*我还有其他事情*/}
            {/*</p>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>
          <div className="wires">
            <Form onSubmit={this.sendMessage}>
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
                <Upload
                  accect='*'
                  action={DOMAIN+'/common/file/upload'}
                  name='file'
                  showUploadList={false}
                  onChange={(info) => this.sendFile(info)}
                >
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
              {/* 聊天输入框 */}
              <Input.TextArea
                onChange={(e) => this.syncMessage(e)}
                onPressEnter={() => this.sendText()}
                rows={5}
                value={this.state.message}
                className="dopes mt5"
                placeholder="请输入相关内容"
              />
            </Form>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapState = state => {
  return {
    userInfo: state.getIn(["header", "userInfo"]), //用户信息
  };
};
const mapDispath = dispath => {
  return {
    //改变弹出框状态
    changePopupBox(info) {
      dispath(changePopupBox(info));
    }
  };
};

Index = connect(mapState, mapDispath)(Index);

export default Index;
