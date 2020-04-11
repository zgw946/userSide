import React, {Component} from "react";
import "./index.css";
import {Link} from "react-router-dom";
import {Icon, Divider} from "antd";

class index extends Component {
  state = {
    list: [
      {
        id: 1,
        content: "为了保证你的用户安全中的安全，请设置密码",
        account: "账号安全",
        time: "5分钟前"
      },
      {
        id: 2,
        content: "为了保证你的用户安全中的安全，请设置密码?",
        account: "账号安全",
        time: "5分钟前"
      },
      {
        id: 3,
        content: "为了保证你的用户安全中的安全，请设置密码",
        account: "5小时前发布",
        time: "5分钟前"
      }
    ]
  };

  render() {
    return (
        <div>
          {/* 头部 */}
          <div className="message_consult">
					<span style={{color: "#333", float: "left", fontSize: "18px"}}>
						消息
					</span>
            <Link to="/advisory">
						<span style={{color: "#B3B3B3", float: "right"}}>
							更多
							<Icon type="right"/>
						</span>
            </Link>
          </div>
          {/* 内容 */}
          {this.state.list.map(item => (
              <div className="message_text" key={item.id}>
						<span style={{fontSize: "16px", color: "#666", float: "left"}}>
							{item.account}
						</span>
                <span
                    style={{fontSize: "12px", color: "#B3B3B3", float: "right"}}
                >
							{item.time}
						</span>
                <div style={{clear: "both"}}></div>
                <p style={{fontSize: "12px", color: "#333", marginTop: "7px"}}>
                  {item.content}
                </p>
                <Divider/>
              </div>
          ))}
        </div>
    );
  }
}

export default index;
