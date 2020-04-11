import React, {Component} from "react";
import "./index.css";
import {Link} from "react-router-dom";
import {Icon, Divider} from "antd";

class index extends Component {
  state = {
    list: [
      {
        id: 1,
        content: "JavaWeb中Service层异常抛到Controller层处理还是直接处理？",
        issue: "5小时前发布",
        type: "类型:",
        type_content: "婚姻家庭离婚",
        region: "地区:",
        region_detail: "广东省深圳市"
      },
      {
        id: 2,
        content:
            "flutter开发的app为何都比较卡尤其是滑动操作，是开发者的原因还是flutter自身的原因吧?",
        issue: "5小时前发布",
        type: "类型:",
        type_content: "婚姻家庭离婚",
        region: "地区:",
        region_detail: "广东省深圳市"
      },
      {
        id: 3,
        content: "程序语言都是怎么发明的？",
        issue: "5小时前发布",
        type: "类型:",
        type_content: "婚姻家庭离婚",
        region: "地区:",
        region_detail: "广东省深圳市"
      },
      {
        id: 4,
        content: "程序语言都是怎么发明的？",
        issue: "5小时前发布",
        type: "类型:",
        type_content: "婚姻家庭离婚",
        region: "地区:",
        region_detail: "广东省深圳市"
      },
      {
        id: 5,
        content: "程序语言都是怎么发明的？",
        issue: "5小时前发布",
        type: "类型:",
        type_content: "婚姻家庭离婚",
        region: "地区:",
        region_detail: "广东省深圳市"
      }
    ]
  };

  render() {
    return (
        <div>
          {/* 头部 */}
          <div className="lawSquare_consult">
					<span style={{color: "#333", float: "left", fontSize: "18px"}}>
						法律咨询
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
              <div className="lawSquare_text" key={item.id}>
                <p style={{fontSize: "18px", color: "#333"}}>{item.content}</p>
                <span style={{fontSize: "14px", color: "#666"}}>
							{item.issue}
						</span>
                <span
                    style={{fontSize: "14px", color: "#B3B3B3", marginLeft: "40px"}}
                >
							{item.type}
						</span>
                <span
                    style={{fontSize: "14px", color: "#666", marginLeft: "4px"}}
                >
							{item.type_content}
						</span>
                <span
                    style={{fontSize: "14px", color: "#B3B3B3", marginLeft: "40px"}}
                >
							{item.region}
						</span>
                <span
                    style={{fontSize: "14px", color: "#666", marginLeft: "4px"}}
                >
							{item.region_detail}
						</span>
                <Divider/>
              </div>
          ))}
        </div>
    );
  }
}

export default index;
