import React, {Component} from "react";
import ReactDOM from "react-dom";
import Login from './components/login';
import Game from './components/game';
import Signup from './components/signup';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import createHistory from "history/createBrowserHistory"

const history = createHistory();



export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null
        }
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


    render() {
        if (!this.isLogedIn() && history.location.pathname !== '/signup'){
            history.push('/login');
        }else if(this.isLogedIn()){
            history.push('/game');

        }

        return (
            <BrowserRouter>
                <div>
                    <Switch>

                        <Route
                            exact path={"/login"}
                            render={() => <Login setUserId={(e) => this.setUserId(e)}/>}
                        />

                        <Route
                            exact path={"/game"}
                            render={() => <Game/>}
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
