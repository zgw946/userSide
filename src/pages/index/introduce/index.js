import React, {Component} from "react";
import "./index.css";
import {Link} from "react-router-dom";
import {Icon} from "antd";

class index extends Component {
  state = {};

  render() {
    return (
        <div>
          {/* 头部 */}
          <div className="introduce_consult">
					<span style={{color: "#333", float: "left", fontSize: "18px"}}>
						介绍
					</span>
            <Link to="/advisory">
						<span style={{color: "#B3B3B3", float: "right"}}>
							更多
							<Icon type="right"/>
						</span>
            </Link>
          </div>
          {/* 内容 */}
          <div className="introduce_text">
            <p style={{fontSize: "12px", color: "#333", marginTop: "7px"}}>
              这里是大面积的介绍，这里是大面积的介绍，
              这里是大面积的介绍，这里是大面积的介绍，
              这里是大面积的介绍，这里是大面积的介绍，
              这里是大面积的介绍，这里是大面积的介绍，
              这里是大面积的介绍，这里是大面积的介绍，
              这里是大面积的介绍，这里是大面积的介绍， 我还是挺厉害的嘛。
            </p>
          </div>
        </div>
    );
  }
}

export default index;
