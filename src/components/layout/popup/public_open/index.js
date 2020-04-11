import React, {PureComponent} from "react";
import "./index.css";
import {Button, Cascader, Form, Input, Modal, message} from "antd";
import {changePopupBox} from "../actionCreators";
import connect from "react-redux/es/connect/connect";
import {myRequest} from "../../../../function";

class Index extends PureComponent {
  state = {
    list: [], // 地区
    province: 0, // 省份id
    city: 0 // 城市id
  };
  //提交表单
  handleSubmit = e => {
    let that = this;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        myRequest({
          method: "post",
          path: "/consultant/open/index",
          auth: true,
          data: {
            content: values.content,
            province: values.location[0],
            city: values.location[1]
          },
          callback: function (response) {
            console.log(response);
            if (response.data.code === 0) {
              message.success("发布成功");
              that.props.changePopupBox([{type: "public_open"}]); // 关闭弹框
            } else {
              message.error(response.data.msg); // 错误信息
            }
          }
        });
      }
    });
  };

  // 获取选择的地区
  getRegion() {
    let that = this;
    myRequest({
      method: "get",
      path: "/common/location/all_area",
      callback: function (response) {
        if (response.data.code === 0) {
          that.setState({
            list: response.data.data,
            province: response.data.data.id,
            city: response.data.data.parent_id
          });
        }
      }
    });
  }

  //初始化组件
  componentDidMount() {
    this.getRegion(); // 地区
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21}
    };

    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 12,
          offset: 11
        }
      }
    };

    return (
        <Modal
            width={700}
            destroyOnClose={true}
            bodyStyle={{padding: 24}}
            footer={null}
            onCancel={() =>
                this.props.changePopupBox([{type: this.props.popupType}])
            }
            visible={true}
        >
          <h3 style={{textAlign: "center", fontWeight: "bold"}}>发布资讯</h3>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <div>
              <Form.Item label="描述" hasFeedback>
                {getFieldDecorator("content", {
                  rules: [
                    {
                      required: true,
                      message: "请描述您的问题"
                    }
                  ]
                })(
                    <Input.TextArea
                        rows={10}
                        className="TextArease"
                        placeholder="请描述您的问题"
                    />
                )}
              </Form.Item>
              <Form.Item label="归属地" hasFeedback>
                {getFieldDecorator("location", {
                  rules: [
                    {
                      required: true,
                      message: "请选择归属地"
                    }
                  ]
                  // initialValue:[this.state.province,this.state.city]
                })(
                    <Cascader
                        fieldNames={{
                          value: "id",
                          label: "name",
                          children: "children"
                        }}
                        style={{width: 300}}
                        options={this.state.list}
                        placeholder="请选择归属地"
                    />
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  发布
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
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

//数据仓库
Index = connect(null, mapDispath)(Index);
//添加表单
Index = Form.create()(Index);

export default Index;
