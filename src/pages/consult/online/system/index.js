import React, {Component,Fragment} from "react";
import "./index.css";
import {myRequest} from "../../../../function";
import {Link} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller';
import {List, Spin} from "antd";

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],//消息列表
      loading : false,//数据加载中
      page:1,//页码
      pageSize:4,//每页显示数量
      total:0,//总的数据
      hasMore: true,
    };

    this.getMessage();
  }

  //滚动加载数据
  handleInfiniteOnLoad = () => {
    let { list,total } = this.state;
    this.setState({
      loading: true,
    });
    if (list.length >= total) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }

    this.setState({
      page: this.state.page+1
    },() => this.getMessage());
  };

  //获取用户消息
  getMessage(){
    let that = this;

    myRequest({
      method: "get",
      path: "/consultant/user/message",
      auth: true,
      params:{
        page: this.state.page,
        page_size: this.state.pageSize,
        order_by: JSON.stringify([{column:"created",type:"desc"}])
      },
      callback: function (response) {
        that.setState({loading:false});

        if (response.data.code === 0) {
          const data = response.data.data;
          let newlist = data.list;//新数据列表

          //新增key字段
          newlist = newlist.map(item => {
            item.key = item.id;
            return item
          });

          let list = that.state.list;//已加载的数据
          list = list.concat(newlist);//拼接新加载数据

          that.setState({
            list: list,
            page : parseInt(data.page,10),
            pageSize : parseInt(data.page_size,10),
            total : parseInt(data.total_count,10),
          });
        }
      }
    });
  }

  render() {
    return (
      <Fragment>
        <div className="hangs">
          <p className="p_hangs">消息通知</p>
        </div>
        <div className="mycontent">
          <div className="message_container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                dataSource={this.state.list}
                split={false}
                renderItem={item => (
                  <List.Item key={item.key}>
                    <div className="system_message">
                      <h2>{item.type}</h2>
                      <span>{item.content}</span>
                      {
                        item.url ? (
                          <Link to={item.url}>
                            <p
                              style={{
                                marginBottom: "0",
                                float: "right",
                                marginTop: "30px",
                                color: "#6B76FF"
                              }}
                            >
                              立即前往
                            </p>
                          </Link>
                        ) : null
                      }
                    </div>
                  </List.Item>
                )}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className="loading_container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Index;
