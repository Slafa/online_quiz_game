import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Lobby from './lobby'


class Game extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div>
                <Lobby isAdmin={true}/>
            </div>
        );
    }

}


export default withRouter(Game)