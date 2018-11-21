import React, {Component} from "react";
import ReactDOM from "react-dom";
import Login from './components/login';
import Game from './components/game';
import Signup from './components/signup';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import createHistory from "history/createBrowserHistory"
import axios from 'axios'


const history = createHistory();



export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            errorMsg: null
        }
    }

    componentDidMount(){
        this.checkIfAlreadyLoggedIn();
    }

    notFound(){
        return(
            <div>
                <h1>ERROR 404</h1>
                <p>The page you are looking for does not exist!</p>
            </div>
        );
    }

    setUserId(id){
        this.setState({userId: id})
    }

    isLogedIn(){
        return this.state.userId !==null;
    }

    checkIfAlreadyLoggedIn() {

        const url = "/api/V1/user";

        axios.get(url).then((id) =>{
            console.log('inneeee!!!!!!!1');
            console.log('id er: ' + JSON.stringify(id.data.userId));
            this.setUserId(id.data.userId);
        }).catch((err) =>{
            this.setState({errorMsg: "Failed to connect to server: " + err});
        });

    };


    render() {
        //if (this.state.errorMsg !== null) return(<p>{this.state.errorMsg}</p>);
        if (!this.isLogedIn() && history.location.pathname !== '/signup'){
            console.log('ikke logga inn?: ' + this.state.userId);
            history.push('/login');
        }else if(this.isLogedIn()){
            console.log('nå er vi her');
            history.push('/game');
        }

        console.log(this.state.userId);

        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route
                            exact path={"/game"}
                            render={() => <Game userId={this.state.userId} setUserId={this.setUserId}/>}
                        />

                        <Route
                            exact path={"/login"}
                            render={() => <Login setUserId={(e) => this.setUserId(e)}/>}
                        />

                        <Route
                            exact path={"/signup"}
                            render={() => <Signup setUserId={(e) => this.setUserId(e)}/>}
                        />

                        <Route
                            component={this.notFound}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById("root"));
