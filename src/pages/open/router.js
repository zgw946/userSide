import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "../../components/common/loading";

//引入组件
const Index = Loadable({
  loader: () => import("./index"),
  loading: Loading
}); //用户中心首页
const Detail = Loadable({
  loader: () => import("./detail"),
  loading: Loading
}); //详情
const Mine = Loadable({
  loader: () => import("./mine"),
  loading: Loading
}); //我发布的

class UserRouter extends Component {
  render() {
    return (
        <Switch>
          <Route exact path="/open/index" component={Index}/>
          <Redirect exact from="/open" to="/open/index"/>
          <Route path="/open/detail/:id" component={Detail}/>
          <Route path="/open/mine" component={Mine}/>
        </Switch>
    );
  }
}

export default UserRouter;
