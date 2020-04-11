import React, { Component, Fragment } from "react";
import { Provider } from "react-redux";
import store from "./store"; //数据仓库
import Loadable from "react-loadable";
import Loading from "../src/components/common/loading";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import { getLocalStorage } from "./function";
import { getUserInfo } from "./components/layout/header/actionCreators";

// 引入组件
const Popup = Loadable({
  loader: () => import("./components/layout/popup"),
  loading: Loading
}); //弹出框
const Header = Loadable({
  loader: () => import("./components/layout/header"),
  loading: Loading
}); //头部
const Footer = Loadable({
  loader: () => import("./components/layout/footer"),
  loading: Loading
}); //底部
const Index = Loadable({
  loader: () => import("./pages/index"),
  loading: Loading
}); //首页
const Consult = Loadable({
  loader: () => import("./pages/consult"),
  loading: Loading
}); //咨询
const Introduce = Loadable({
  loader: () => import("./pages/introduce"),
  loading: Loading
}); //介绍页
const OpenRouter = Loadable({
  loader: () => import("./pages/open/router"),
  loading: Loading
}); //法律广场
const UserRouters = Loadable({
  loader: () => import("./pages/user/router"),
  loading: Loading
}); //用户中心
const Pay = Loadable({
  loader: () => import("./pages/pay"),
  loading: Loading
}); //支付

class App extends Component {
  //获取用户信息
  getUserInfo() {
    //判断是否已登录
    if (getLocalStorage("api_token")) {
      //获取用户信息
      store.dispatch(getUserInfo());
    } else {
    }
  }

  //初始化组件
  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route
            path="/"
            render={() => (
              <Fragment>
                <Popup />
                <Header />
                <Switch>
                  <Route exact path="/" component={Index} />
                  <Route path="/open" component={OpenRouter} />
                  <Route path="/introduce" component={Introduce} />
                  <Route path="/pay" component={Pay} />
                  <Route path="/consult" component={Consult} />
                  <Route
                    path="/user"
                    render={() =>
                      getLocalStorage("api_token") ? (
                        <Route component={UserRouters} />
                      ) : (
                        <Redirect to="/" />
                      )
                    }
                  />
                </Switch>
                <Footer />
              </Fragment>
            )}
          />
        </Router>
      </Provider>
    );
  }
}

export default App;
