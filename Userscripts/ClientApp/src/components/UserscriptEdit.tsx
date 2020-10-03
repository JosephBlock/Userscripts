import React, {Component} from "react";
import authService from "./api-authorization/AuthorizeService"
import "../css/UserscriptUpload.css"
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ApplicationPaths, QueryParameterNames} from "./api-authorization/ApiAuthorizationConstants";
import CreatableSelect from "react-select/creatable";

export class UserscriptEdit extends Component {
    static displayName = UserscriptEdit.name;
    static PageName = "Edit Userscript";

    constructor(props) {
        super(props);
        const {params} = (this.props as any).match;
        this.state = {
            userscript: [],
            loading: true,
            userscriptId: (params as any).id,
            user: [],
            isCreator: false,
            script_name: '',
            code: '',
            description: '',
            selectOptions: [],
            selectedOptions: [],
            isLoading: false,
            success: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if (event.target.id === "code") {
            this.setState({code: event.target.value})
        } else {
            this.setState({script_name: event.target.value});
        }
    };

    componentDidMount() {
        document.title = UserscriptEdit.PageName;
        this.GetUserscript = this.GetUserscript.bind(this);

        this.getOptions()
        authService.getUser().then((data: any) => {
            this.setState({user: data});
        })
        this.GetUserscript();
        this.renderUserscript = this.renderUserscript.bind(this)
    }

    handleCreate = (inputValue: any) => {
        this.setState({isLoading: true});
        const newOption = this.createOption(inputValue);
        this.setState({
            isLoading: false,
        });
        this.getOptions();

    };

    async createOption(option: string) {
        this.setState({isLoading: true});
        const token = await authService.getAccessToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");

        const opt = {
            "categoryName": option
        };
        const response = await fetch("api/Categories", {
            method: 'post',
            body: JSON.stringify(opt),
            headers: myHeaders
        }).then(function (response) {
            if (response.ok) {
                return response.json();
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

        }).catch(error => toast.error('Error with the request ' + error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }));
        await this.getOptions();
        this.setState({isLoading: false})
    }

    async getOptions() {
        this.setState({isLoading: true});
        const token = await authService.getAccessToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch("api/Categories", {
            method: 'get',
            headers: myHeaders
        }).then(function (response) {
            if (response.ok) {
                return response.json();
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
        }).catch(error => toast.error('Error with the request ' + error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }));
        console.log(response)
        const options = response.map((d: { categoryId: string; categoryName: string; }) => ({
            "value": d.categoryId,
            "label": d.categoryName
        }))
        this.setState({selectOptions: options, isLoading: false})
    }

    renderUserscript(userscript: object, id: any, isCreator: boolean) {
        if (userscript === undefined) {
            return (<><p>
                undefined
            </p></>)
        }
        const link = document.createElement("a");
        link.href = "/api/userscripts/" + id + ".user.js";
        const editLink = document.createElement("a");
        editLink.href = "/api/userscript/" + id + "/edit";

        return (<div>
                <form onSubmit={this.handleSubmit}>

                    <div className="row">
                        <div className="form-group">
                            <label htmlFor={"script_name"}>
                                Script name: </label>
                            <input type="text" id={"script_name"} value={(this.state as any).script_name}
                                   onChange={this.handleChange}/>

                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="code">Description:</label>
                            <textarea className="form-control us_textarea largeWidth" id="description" rows={3}
                                      onChange={e => this.setState({description: e.target.value})}
                                      value={(this.state as any).description}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="code">Script:</label>
                            <textarea className="form-control us_textarea largeWidth" id="code" rows={15}
                                // onChange={e => this.setState({code: e.target.value})}
                                      onChange={this.handleChange}
                                      value={(this.state as any).code}/>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"form-group"}>
                            <label htmlFor={"categories"}>Categories:</label>
                            <CreatableSelect id={"categories"} className={"largeWidth"}
                                             isMulti
                                             onChange={this.handleSelectChange}
                                             options={(this.state as any).selectOptions}
                                             onCreateOption={this.handleCreate}
                                             value={(this.state as any).selectedOptions}
                            />
                        </div>
                    </div>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }

    handleSelectChange = (newValue: any, actionMeta: any) => {
        console.log(newValue)
        this.setState({selectedOptions: newValue});
    };

    handleSubmit(event) {
        const aState = this.state as any;
        if (aState.script_name === "" || aState.code === "") {
            toast.error('Form cannot be empty', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else {
            const theUserscript = {...aState.userscript};
            theUserscript.scriptName = aState.script_name;
            theUserscript.script = aState.code;

            theUserscript.categories = aState.selectedOptions.map((d: { value: string; label: string; }) => ({
                "categoryId": d.value,
                "category": {
                    "categoryName": d.label,
                    "categoryId": d.value
                }
            }));
            theUserscript.description = aState.description;
            //this.setState({script_name: "", code: "", description: "", selectedOptions: []});
            console.log(theUserscript);
            var submitted = this.submitScript(theUserscript);
            console.log(submitted);
            const link = document.createElement("a");
            link.href = "/userscript/" + aState.userscriptId;
            const returnUrl = `${link.pathname}${link.search}${link.hash}`;
            //this.props.history.push(returnUrl)
        }
        event.preventDefault();

    };

    async submitScript(opts) {
        var success = false;
        const token = await authService.getAccessToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");
        console.log(token)
        const aState = this.state as any;
        const response = await fetch("api/Userscripts/" + aState.userscriptId, {
            method: 'put',
            body: JSON.stringify(opts),
            headers: myHeaders
        }).then(function (response) {
            if (response.ok) {
                toast.success('Userscript updated!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                success = true;
                return response.json();
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

        }).catch(error => toast.error('Error with the request ' + error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }));
        this.setState({success: success})
    }

    async GetUserscript() {
        const token = await authService.getAccessToken();
        let myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        console.log(token);
        const aState = this.state as any;
        const response = await fetch("api/Userscripts/" + aState.userscriptId, {
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                const link = document.createElement("a");
                link.href = (this.props as any).location.pathname;
                const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
                const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
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
            console.log(data.categories)
            const options = data.categories.map((d: {
                category: any;
                categoryId: string; categoryName: string;
            }) => ({
                "value": d.category.categoryId,
                "label": d.category.categoryName
            }))
            console.log(options)
            this.setState({
                script_name: data.scriptName,
                code: data.script,
                description: data.description,
                selectedOptions: options
            })

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
        let contents = (this.state as any).loading
            ? <p><em>Loading...</em></p>
            : this.renderUserscript((this.state as any).userscript, (this.state as any).userscriptId, (this.state as any).isCreator);
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