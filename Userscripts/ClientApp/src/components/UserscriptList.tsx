import React, {Component, version} from "react";
import authService from "./api-authorization/AuthorizeService"
import "../css/UserscriptUpload.css"
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ApplicationPaths, QueryParameterNames} from "./api-authorization/ApiAuthorizationConstants";
import moment from "moment-timezone";
import {useTable} from 'react-table';
import UserscriptListTable from './tables/UserscriptListTable'

export class UserscriptList extends Component {
    static displayName = UserscriptList.name;

    constructor(props: any) {
        super(props);
        this.state = {
            userscript: [],
            loading: true
        };
    }

    componentDidMount() {
        this.GetUserscript = this.GetUserscript.bind(this);
        this.GetUserscript();
    }
    
    async GetUserscript() {
        const token = await authService.getAccessToken();
        let myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        console.log(token);

        const response = await fetch("api/Userscripts", {
            method: 'get',
            headers: myHeaders
        }).then((response: any) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                const link = document.createElement("a");
                link.href = (this.props as any).location.pathname;
                const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
                const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`
                console.log(redirectUrl);
                (this.props as any).history.push(redirectUrl)
            } else {
                toast.error('Error with the request ' + response.text(), {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

        }).then((data: any) => {
            console.log(data);
            this.setState({userscript: data, loading: false});

        }).catch(error => toast.error('Error with the request ' + error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }));
    }

    render() {
        return( <>
            <ToastContainer/>
            <div className="container-fluid">
                <UserscriptListTable data={(this.state as any).userscript} />
            </div>
        </>)
    };


}