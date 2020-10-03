import React, {Component} from "react";
import authService from "./api-authorization/AuthorizeService"
import "../css/UserscriptUpload.css"
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ApplicationPaths, QueryParameterNames} from "./api-authorization/ApiAuthorizationConstants";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import moment from "moment-timezone";
import {UserscriptEdit} from "./UserscriptEdit";
import AuthorizeRoute from "./api-authorization/AuthorizeRoute";

export class UserscriptItem extends Component {
    static displayName = UserscriptItem.name;
    static PageName = " | Userscript";

    constructor(props) {
        super(props);
        this.state = {
            userscript: [],
            loading: true,
            userscriptId: (this.props as any).match.params.id,
            user: [],
            isCreator: false
        };
    }

    componentDidMount() {
        this.GetUserscript = this.GetUserscript.bind(this);
        this.GetUserscript();
        authService.getUser().then((data: any) => {
            this.setState({user: data});
        })
    }

    static renderUserscript(userscript: any, id: any, isCreator: boolean) {
        if (userscript === undefined) {
            return (<><p>
                undefined
            </p></>)
        }
        document.title = `${userscript.scriptName}` + UserscriptItem.PageName;
        const link = document.createElement("a");
        link.href = "/api/userscripts/" + id + ".user.js";
        const editLink = document.createElement("a");
        editLink.href = "/userscript/" + id + "/edit";

        const tz = moment.tz.guess();
        const created = moment.utc(userscript.created);
        const cTz = created.tz(tz).format('MMMM Do YYYY, h:mm:ss a');
        const updated = moment.utc(userscript.lastUpdated);
        const uTz = updated.tz(tz).format('MMMM Do YYYY, h:mm:ss a');

        const userscriptUrl = `${link.protocol}//${link.host}${link.pathname}`;
        const editUrl = `${editLink.protocol}//${editLink.host}${editLink.pathname}`;
        const editButton = isCreator ? <a href={editUrl} className={"btn btn-warning"}>Edit Userscript</a> : null;
        return (<div>
                <p>Userscript: {userscript.scriptName}</p>
                <p>Uploaded by: {userscript.creator.userName}</p>
                <p>Created: {cTz}</p>
                <p>Last Updated: {uTz}</p>
                <p>Version: 1.{userscript.versionNumber}</p>
                <p>Description: {userscript.description}</p>
                <p>
                    <span className={"btn-group"}><a href={userscriptUrl} className={"btn btn-primary"}>Download
                        Userscript</a>{editButton}</span>
                </p>
                <SyntaxHighlighter language="javascript" style={dark}
                                   showLineNumbers={true}>
                    {userscript.script}
                </SyntaxHighlighter>
            </div>
        );
    }

    async GetUserscript() {
        const token = await authService.getAccessToken();
        let myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        console.log(token);

        const response = await fetch("api/Userscripts/" + (this.state as any).userscriptId, {
            method: 'get',
            headers: myHeaders
        }).then((response) => {
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

        }).then((data) => {
            console.log(data);
            if ((this.state as any).user.sub === data.creator.id) {
                this.setState({isCreator: true})
            }
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
        console.log(this.state)
        let contents = (this.state as any).loading
            ? <p><em>Loading...</em></p>
            : UserscriptItem.renderUserscript((this.state as any).userscript, (this.state as any).userscriptId, (this.state as any).isCreator);
        return (
            <>
                <ToastContainer/>
                <div className="container-fluid">
                    {contents}
                </div>
            </>
        );
    };


}