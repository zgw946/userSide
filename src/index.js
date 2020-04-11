import "babel-polyfill";//兼容用到的，不可调整位置
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// 引入浏览器兼容样式
import './statics/css/reset.css';
// 引入全局样式
import './statics/css/global.css';
import 'antd/dist/antd.css';
import 'normalize.css';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

ReactDOM.render((
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
), document.getElementById('root'));
