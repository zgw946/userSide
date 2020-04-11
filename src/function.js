/*
* 公共函数
* */
import {DOMAIN} from "./constant";
import axios from "axios/index";
import {fromJS} from "immutable";
import { message } from 'antd';
import store from "./store";
import {clearUserInfo} from "./components/layout/header/actionCreators";



//储存json对象到localStorage
export var setLocalStorage = function (key,obj = {}) {
  let jsonObj = JSON.stringify(obj); //转化为JSON字符串
  localStorage.setItem(key, jsonObj);
}

//获取localStorage中的json对象
export var getLocalStorage = function (key) {
  return JSON.parse(localStorage.getItem(key));
}

//获取文件对象本地路径
export var getObjectURL = function (file) {
  let url = null;
  if (window.createObjcectURL !== undefined) {
    url = window.createOjcectURL(file);
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
};

//自定义请求
export var myRequest = function (config = {}) {
  /*
  * method [请求方式]
  * path [请求路径]
  * headers [头部参数]
  * params [url参数]
  * data [body参数]
  * auth [是否需要认证]
  * api [接口路径]
  * callback [回调函数]
  * errorCallback [错误回调函数]
  * */

  //检查必填数据
  if(!config.method || !config.path || !config.callback){
    return false;
  }

  //判断是否需要认证
  if(config.auth){
    let api_token = getLocalStorage('api_token');

    //如果存在其他头部参数则合并
    if(config.headers){
      config.headers = fromJS(config.headers);
      config.headers = config.headers.set('api_token',api_token);
      config.headers = config.headers.toJSON();
    }else{
      config.headers = {
        'api_token' : api_token,
      };
    }
  }

  //请求服务器资源
  axios({
    method: config.method,//请求方式
    baseURL: DOMAIN,//基础域名
    url: config.path,//路径
    headers: config.headers ? config.headers : {},//头参数
    params: config.params ? config.params : {},//url参数
    data: config.data ? config.data : {},//body参数
    responseType : config.responseType ? config.responseType : 'json'//返回类型
  }).then(function(response){

    //如果是认证请求
    if(config.auth && response.data.code === 401){
      //返回401则清除登录信息
      clearToken();
    }

    //需要执行回调方法
    config.callback(response);

  }).catch(function(error){
    //请求错误需要执行回调方法
    if(config.errorCallback){
      config.errorCallback(error);
    }
  });
};

//清除登录信息
export var clearToken = function () {
  //清除登录信息
  localStorage.removeItem('api_token');

  //清除用户信息
  store.dispatch(clearUserInfo());

  //弹出提示
  message.warn("认证信息已失效，请重新登录！",1,() => {
    window.location.reload();
  });
};

//获取url参数
export var getUrlParam = function (paraName) {
  let url = document.location.toString();
  let arrObj = url.split("?");

  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split("&");
    let arr;

    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");

      if (arr != null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return "";
  }
  else {
    return "";
  }
};

//判断两个时间是否有交集
export var isDateIntersection = function (start1, end1, start2, end2) {

  let startdate1 = new Date(start1.replace("-", "/").replace("-", "/"));
  let enddate1 = new Date(end1.replace("-", "/").replace("-", "/"));

  let startdate2 = new Date(start2.replace("-", "/").replace("-", "/"));
  let enddate2 = new Date(end2.replace("-", "/").replace("-", "/"));

  if (startdate1 >= startdate2 && startdate1 <= enddate2) {//startdate1介于另一个区间之间
    return true;
  }

  if (enddate1 >= startdate2 && enddate1 <= enddate2) {//enddate1介于另一个区间之间
    return true;
  }

  if (startdate1 <= startdate2 && enddate1 >= enddate2) {//startdate1-enddate1的区间大于另一个区间，且另一个区间在startdate1-enddate1之间
    return true;
  }

  return false;
};

//计算文件大小
export var getFileSize = function (fileByte) {
  let fileSizeByte = fileByte;
  let fileSizeMsg = "";
  if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
  else if (fileSizeByte === 1048576) fileSizeMsg = "1MB";
  else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
  else if (fileSizeByte > 1048576 && fileSizeByte === 1073741824) fileSizeMsg = "1GB";
  else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  else fileSizeMsg = "文件超过1TB";
  return fileSizeMsg;
};

//检查文件类型
export var computationType = function (type) {
  const img = ['jpg','png','jpeg'],
    word = ['doc','docx'],
    text = ['txt'],
    excel = ['xls','xlsx'],
    ppt = ['ppt','pptx'],
    pdf = ['pdf'],
    packet = ['rar','zip'];

  let fileType = '';

  //图片类型
  if(img.indexOf(type) > -1){
    fileType = 'image';
  }else if(word.indexOf(type) > -1){
    fileType = 'word';
  }else if(text.indexOf(type) > -1){
    fileType = 'text';
  }else if(excel.indexOf(type) > -1){
    fileType = 'excel';
  }else if(ppt.indexOf(type) > -1){
    fileType = 'ppt';
  }else if(pdf.indexOf(type) > -1){
    fileType = 'pdf';
  }else if(packet.indexOf(type) > -1){
    fileType = 'packet';
  }

  return fileType;
};