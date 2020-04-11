import React, {PureComponent} from 'react';
import { Spin, Alert } from 'antd';

//正在加载
class Loading extends PureComponent {

  render() {

    return (
      <Spin tip="Loading...">
        <Alert
          message="加载中"
          description="正在加载，请稍后..."
          type="info"
        />
      </Spin>
    );
  }
}


export default Loading;