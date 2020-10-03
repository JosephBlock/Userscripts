import React, {Component} from "react";
import authService from "./api-authorization/AuthorizeService"
import "../css/UserscriptUpload.css"
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatableSelect from 'react-select/creatable';

export class UserscriptUpload extends Component {
    static displayName = UserscriptUpload.name;

    constructor(props) {
        super(props);
        this.state = {
            script_name: '',
            code: '',
            description: '',
            selectOptions: [],
            selectedOptions: [],
            isLoading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getOptions()
    }

    handleChange(event) {
        this.setState({script_name: event.target.value});
        console.log(event.target.value);
    };

    handleSelectChange = (newValue: any, actionMeta: any) => {
        this.setState({selectedOptions:newValue});
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
            
            let postdata = {
                "ScriptName": aState.script_name,
                "Script": aState.code,
                "Description": aState.description,
                "Categories":aState.selectedOptions.map((d: { value: string; label: string; }) => ({
                    "categoryId": d.value,
                    "categoryName": d.label
                }))
            }
            this.setState({script_name: "", code: "", description: "",selectedOptions: []});
            console.log(postdata);
            this.submitScript(postdata);
        }
        event.preventDefault();

    };

    async submitScript(opts) {
        const token = await authService.getAccessToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");
        console.log(token)
        const response = await fetch("api/Userscripts", {
            method: 'post',
            body: JSON.stringify(opts),
            headers: myHeaders
        }).then(function (response) {
            if (response.ok) {
                toast.success('Userscript added!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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

        }).then(function (data) {
            console.log(data)
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
        console.log(response)
        await this.getOptions();
        this.setState({isLoading: false})
    }

    render() {
        const {isLoading} = this.state as any;

        return (
            <>
                <ToastContainer/>
                <div className="container-fluid">
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
                                <textarea className="form-control us_textarea largeWidth" id="code" rows={3}
                                          onChange={e => this.setState({code: e.target.value})}
                                          value={(this.state as any).code}/>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"form-group"}>
                                <label htmlFor={"categories"}>Categories:</label>
                                <CreatableSelect id={"categories"} className={"largeWidth"}
                                                 isMulti
                                                 isLoading={isLoading}
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
            </>
        );
    };


}