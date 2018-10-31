import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";


class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            password: "",
            password2: "",
            errorMsg: null
        };
    }

    render() {
        return (
            <div className={'cont'}>
                <div>
                    <label><b>Username</b></label>
                    <br/>
                    <input onChange={(e) => this.changeValue(e)} name={'userName'} type={'text'}
                           placeholder={"Enter desired username"}/>
                </div>
                <div>
                    <label><b>Password</b></label>
                    <br/>
                    <input onChange={(e) => this.changeValue(e)} name={'password'} type={'password'}
                           placeholder={'Enter desired password'}/>
                </div>
                <div>
                    <label><b>Re enter</b></label>
                    <input onChange={(e) => this.changeValue(e)} name={'password2'} type={'password'}
                           placeholder={'Reenter password'}/>
                </div>
                <button onClick={() => this.signUp()}>Sign up</button>

                <div>
                    {this.state.errorMsg}
                </div>
            </div>
        )

    }

    changeValue(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    async signUp() {
        const {userName, password, password2} = this.state;

        if (password !== password2) {
            this.setState({errorMsg: "Passwords do not match"});
            return;
        }

        axios.post('/api/V1/signup', {
            userId: userName,
            password
        })
            .then(() => {

                this.setState({errorMsg: null});
                this.props.setUserId(userName);
                this.props.history.push("/game");
            })
            .catch((err) => {

                if (err.response.status === 400) {
                    this.setState({errorMsg: "Invalid userId/password"});
                    return;
                }

                if (err.response.status !== 204) {
                    this.setState({
                        errorMsg:
                            "Error when connecting to server: status code " + response.status
                    });
                }
            });
    }

};


export default withRouter(Signup);