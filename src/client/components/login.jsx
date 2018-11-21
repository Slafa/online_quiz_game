import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import axios from 'axios'


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            password: "",
            errorMsg: null
        };
    }


    changeValue(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        return (
            <div className={'form-horizontal'}>
                <Link to={'/signup'}><p className={''}>sign up</p></Link>
                <div className={'well'}>
                    <label><b>Username</b></label>
                    <br/>
                    <input onChange={(e) => this.changeValue(e)} name={'userName'} type={'text'}
                           placeholder={"Enter username"}/>
                </div>
                <div className={''}>
                    <label><b>Password</b></label>
                    <br/>
                    <input onChange={(e) => this.changeValue(e)} name={'password'} type={'password'}
                           placeholder={'Enter password'}/>
                </div>
                <button className={'btn btn-default'} onClick={() => this.logIn()}>Login</button>

                <div>{this.state.errorMsg}</div>
            </div>
        )
    }

    logIn() {
        const {userName, password} = this.state;

        axios.post('/api/V1/login', {
            userId: userName,
            password
        }).then(() => {

            this.setState({errorMsg: null});
            this.props.setUserId(userName);
            this.props.history.push("/game");
        }).catch((err) => {

            if (err.response.status === 401) {
                this.setState({errorMsg: "Invalid userId/password"});
                return;
            }

            if (err.response.status === 400) {
                this.setState({
                    errorMsg:
                        "Error when connecting to server: status code " + err.response.status
                });
            }
        });
    };


};


export default withRouter(Login);