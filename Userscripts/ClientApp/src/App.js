import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import {ApplicationPaths} from './components/api-authorization/ApiAuthorizationConstants';
import {UserscriptUpload} from "./components/UserscriptUpload"
import {UserscriptItem} from "./components/UserscriptItem";

import './custom.css'
import {UserscriptList} from "./components/UserscriptList";
import {UserscriptEdit} from "./components/UserscriptEdit";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home}/>
                <AuthorizeRoute path='/fetch-data' component={FetchData}/>
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes}/>
                <AuthorizeRoute path='/uploadUserscript' component={UserscriptUpload}/>
                <AuthorizeRoute exact path='/Userscript/:id' component={UserscriptItem}/>
                <AuthorizeRoute exact path='/Userscript/:id/edit' component={UserscriptEdit}/>
                <AuthorizeRoute path='/Userscripts' component={UserscriptList}/>
            </Layout>
        );
    }
}
