import React, {Component, Fragment} from "react";
import "./index.css";
import {Avatar, Tooltip, Tree, Icon, message, Button, Divider, Form, Upload, Input} from "antd";
import {computationType, getFileSize, getLocalStorage, myRequest, setLocalStorage} from "../../../function";
import moment from "moment";
import {DOMAIN, ONLY_DOMAIN} from "../../../constant";
import ReconnectingWebSocket from "reconnecting-websocket";
import {changePopupBox} from "../../../components/layout/popup/actionCreators";
import connect from "react-redux/lib/connect/connect";

const { TreeNode } = Tree;

//未登录法律顾问
class Index extends Component {

  constructor(props) {
    super(props);

    this.state = {
      commonProblem: [], //常见问题
      selected: 1,//当前鼠标移入的常见问题
      conversationKey:"",//匿名咨询唯一识别码
      list: [], //会话详情容器
      page: 1, //当前显示页数
      pageSize: 20, //每页显示数据数量
      totalPage: 0, //数据总页数
      rws: null, //即时通讯长连接
      message: "" //输入框内容
    };

    this.commonProblem();//获取常见问题
    this.createAnonymous();//创建/读取匿名会话
  }

  //修改显示数量
  getMore() {
    this.setState(
      {
        pageSize: this.state.pageSize + 20
      },
      () => this.getConversationDetail()
    );
  }

  //创建/读取匿名会话
  createAnonymous() {
    const conversationKey = getLocalStorage('conversation_key');

    let that = this;
    // 发送请求
    myRequest({
      method: "post",
      path: "/common/conversation/adviser/create_anonymous",
      data:{
        key:conversationKey
      },
      callback: function (response) {
        // // 处理返回结果
        if (response.data.code === 0) {
          const conversationKey = response.data.data.key;
          that.setState({
            conversationKey
          },() => {
            //把key存到浏览器缓存中
            setLocalStorage("conversation_key",conversationKey);

            //获取会话内容
            that.getConversationDetail();
          });
        }
      }
    })
  }

  //获取会话内容
  getConversationDetail(){
    let that = this;
    myRequest({
      method: "get",
      path: "/common/conversation/adviser/anonymous",
      params: {
        key:this.state.conversationKey,
        page: that.state.page,
        page_size: that.state.pageSize
      },
      callback: function(response) {
        if (response.data.code === 0) {
          let originalList = [];
          if (response.data.data.list) {
            originalList = response.data.data.list.reverse();
          }

          let list = []; //最新的本地数据

          //划分时间段（每分钟为一个区间）
          originalList.map(item => {
            let key = moment(item.created, "YYYY-MM-DD hh:mm").calendar();

            //判断数组是否存在
            if (!list[key]) {
              list[key] = [];
            }

            list[key].push(item);

            return null;
          });

          that.setState(
            {
              list,
              totalPage: response.data.data.total_page
            },
            () => {
              //首次获取内容时跳到最新的消息
              if (that.state.pageSize === 20) {
                that.contentNode.scrollTop = that.contentNode.scrollHeight;
              }

              //判断会话是否开启
              if(!that.state.rws) {
                //获取会话详情后开启正常会话
                that.makeWebSocket();
              }
            }
          );
        }
      }
    });
  }

  //建立websocket
  makeWebSocket() {
    const conversationKey = getLocalStorage("conversation_key");

    if (conversationKey) {
      let url =
        "ws://" +
        ONLY_DOMAIN +
        "/common/conversation/adviser/open_conversation?key=" +
        encodeURIComponent(conversationKey);
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
        message.error("会话连接失败，请重试！");
      });
    }
  }

  //把消息添加进消息列表
  addList(message) {
    // 这里是你拿到数据后进行的处理
    //你可以调用action 来触发消息给页面上展示 例如 这些消息方法需要你自己来封装
    let list = this.state.list;

    //划分时间段（每分钟为一个区间）
    let key = moment(message.created, "YYYY-MM-DD hh:mm").calendar();

    //判断数组是否存在
    if (!list[key]) {
      list[key] = [];
    }

    list[key].push(message);

    //判断聊天信息框是否滚动到最新消息
    let bottom = false;
    if (this.contentNode.scrollHeight && this.contentNode.scrollTop) {
      if (this.contentNode.scrollHeight - this.contentNode.scrollTop <= 400) {
        bottom = true;
      }
    }

    this.setState(
      {
        list
      },
      () => {
        //当消息框不是滚动到最下面时，如果接收到的是自己发送的消息则滚动到最底部
        if (message.member_type === 1 || bottom) {
          this.contentNode.scrollTop = this.contentNode.scrollHeight;
        }
      }
    );
  }

  //同步输入框的内容
  syncMessage(e) {
    this.setState({
      message: e.target.value.replace(/[\r\n]/g, "")
    });
  }

  //发送文本消息
  sendText() {
    let sendMessgae = this.state.message; //获取文本框中内容

    //输入框有内容时才允许发送
    if (sendMessgae) {
      let message = {};
      message.content = sendMessgae; //消息内容
      this.state.rws.send(JSON.stringify(message));
      this.setState(
        {
          message: ""
        },
        () => {
          //模拟消息
          let imitateData = {};
          imitateData.id = new Date().getTime();
          imitateData.type = 1;
          imitateData.member_type = 1;
          imitateData.content = sendMessgae;
          imitateData.created = moment().format("YYYY-MM-DD HH:mm");
          this.addList(imitateData);
        }
      );
    }
  }

  //发送文件
  sendFile(info) {
    if (info.file.status === "done") {
      let message = {};
      const file = info.file.response.data;
      message.file = { id: file.id }; //消息内容
      this.state.rws.send(JSON.stringify(message));

      //模拟消息
      let imitateData = {},
        imitateFile = {};

      //设置文件信息
      imitateFile.id = file.id;
      imitateFile.type = file.type;
      imitateFile.url = file.url;
      imitateFile.original_name = file.original_name;
      imitateFile.size = file.size;

      //设置模拟消息
      imitateData.id = new Date().getTime();
      imitateData.member_type = 1;
      imitateData.file = imitateFile;
      imitateData.created = moment().format("YYYY-MM-DD HH:mm");
      this.addList(imitateData);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 上传失败`);
    }
  }

  //选择常见问题自动复制到输入框中
  onSelect = (selectedKeys, info) => {

    this.setState({
      message : info.node.props.data
    });
  };

  //获取常见问题
  commonProblem() {
    let that = this;
    // 发送请求
    myRequest({
      method: "get",
      path: "/common/consultant/robot/common_problem",
      callback: function (response) {
        // // 处理返回结果
        if (response.data.code === 0) {
          that.setState({
            commonProblem: response.data.data
          });
        }
      }
    })
  }

  componentWillUnmount() {

    //判断会话是否开启
    if(this.state.rws) {
      //获取会话详情后开启正常会话
      this.makeWebSocket();
    }
  }

  render() {
    const list = this.state.list; //消息列表

    return (
      <Fragment>
        <div className="homes">
          <div className="chat_Consultings">
            {/* {左边部分} */}
            <div className="chats">
              <div className="issue">
                <p className="p_issue">常见问题</p>
              </div>
              <Tree
                onSelect={this.onSelect}
              >
                {
                  this.state.commonProblem.map((item) => (
                    <TreeNode title={(
                      <div className="wenti">{item.name}</div>
                    )} key={"t_"+item.id} selectable={false}>
                      {
                        item.problems.map(itemChild => (
                          <TreeNode data={itemChild.content} title={(
                            <div className="wenti">
                              <Tooltip placement="topLeft" title={itemChild.content}>
                                {itemChild.content}
                              </Tooltip>
                            </div>
                          )} key={itemChild.id} />
                        ))
                      }
                    </TreeNode>
                  ))
                }
              </Tree>
            </div>
            <div className="windows">
              {/* <!-- 头部 --> */}
              <div className="hangs">
                <p className="p_hangs">法律顾问</p>
              </div>
              <div className="mycontent">
                <div ref={node => (this.contentNode = node)} className="my_counselor">
                  {//判断是否已展示全部消息
                    this.state.totalPage <= 1 ? null : (
                      <Button
                        onClick={() => this.getMore()}
                        style={{ marginLeft: 287 }}
                        type="link"
                      >
                        查看更多记录
                      </Button>
                    )}
                  {Object.keys(list).map(time => {
                    const item = list[time];

                    return (
                      <div key={time} className="message_box">
                        <p className="tac f12px">{time}</p>
                        {item.map(itemChild => (
                          <Fragment key={itemChild.id}>
                            {itemChild.member_type === 1 ? (
                              <Avatar
                                size={40}
                                shape="square"
                                icon="user"
                                className="message_head rf"
                              />
                            ) : (
                              <Avatar
                                src={require("../../../statics/images/聊天界面/avatar_robot.png")}
                                size={40}
                                shape="square"
                                icon="user"
                                className="message_head lf"
                              />
                            )}
                            <div
                              className={
                                "message_content " +
                                (itemChild.member_type === 1 ? "rf mr26" : "lf ml25")
                              }
                            >
                              {(() => {
                                switch (itemChild.type) {
                                  case 1:
                                    return (
                                      <span style={{ color: "#333" }}>
                                        {itemChild.content}
                                      </span>
                                    );
                                  case 6:
                                    return (
                                      <span style={{color: "#333"}}>为保证服务质量，建议先<a onClick={() => this.props.changePopupBox([{ type: "login" }])}>登录</a>！</span>
                                    );
                                  default:
                                    return (
                                      <div>
                                        {/* 音乐视频 */}
                                        <div
                                          style={{
                                            float: "left",
                                            margin: "8px 5px 5px 10px"
                                          }}
                                        >
                                          {(() => {
                                            const file = itemChild.file;
                                            const fileType = file.type.replace(".", "");
                                            const type = computationType(fileType); //计算类型
                                            let cover = ""; //封面
                                            switch (type) {
                                              case "image":
                                                cover = file.url;

                                                break;
                                              case "word":
                                                cover = require("../../../statics/images/word.png");

                                                break;
                                              case "text":
                                                cover = require("../../../statics/images/text.png");

                                                break;
                                              case "excel":
                                                cover = require("../../../statics/images/excel.png");

                                                break;
                                              case "ppt":
                                                cover = require("../../../statics/images/ppt.png");

                                                break;
                                              case "pdf":
                                                cover = require("../../../statics/images/pdf.png");

                                                break;
                                              case "packet":
                                                cover = require("../../../statics/images/yasuobao.png");

                                                break;
                                              default:
                                                cover = require("../../../statics/images/weizhiwenjian.png");

                                                break;
                                            }

                                            return (
                                              <Avatar shape="square" size={42} src={cover} />
                                            );
                                          })()}
                                        </div>
                                        {/* 详细说明 */}
                                        <div
                                          style={{
                                            float: "right",
                                            margin: "8px 10px 5px 0px"
                                          }}
                                        >
                                    <span className="counselor_file_name">
                                      {itemChild.file.original_name}
                                    </span>
                                          <span
                                            style={{
                                              color: "#ccc",
                                              fontSize: "12px"
                                            }}
                                          >
                                      {getFileSize(itemChild.file.size)}
                                    </span>
                                        </div>
                                        {/* 保存区域 */}
                                        <Divider style={{ marginBottom: "0px" }} />
                                        <div>
                                    <span
                                      style={{
                                        color: "#4586ff",
                                        float: "right",
                                        fontSize: "12px",
                                        marginRight: "8px"
                                      }}
                                    >
                                      下载
                                    </span>
                                          <span
                                            style={{
                                              color: "#4586ff",
                                              float: "right",
                                              fontSize: "12px",
                                              marginRight: "8px"
                                            }}
                                          >
                                      打开
                                    </span>
                                        </div>
                                      </div>
                                    );
                                }
                              })()}
                            </div>

                            <div className="clearfix"></div>
                          </Fragment>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="wires">
                  <Form onSubmit={this.sendMessage}>
                    {/* 上传文件夹 */}
                    <div
                      style={{
                        float: "left",
                        width: "14px",
                        marginLeft: "10px"
                      }}
                    >
                      <Upload
                        accect="*"
                        action={DOMAIN + "/common/file/upload"}
                        name="file"
                        showUploadList={false}
                        onChange={info => this.sendFile(info)}
                      >
                        <Icon type="file-text" />
                      </Upload>
                    </div>
                    {/* 聊天输入框 */}
                    <Input.TextArea
                      onChange={e => this.syncMessage(e)}
                      onPressEnter={() => this.sendText()}
                      rows={5}
                      value={this.state.message}
                      className="dopes mt5"
                      placeholder="请输入相关内容"
                    />
                  </Form>
                </div>
              </div>
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
    },
  };
};

Index = connect(null, mapDispath)(Index);

export default Index
