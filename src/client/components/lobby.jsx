import React, {Component} from "react";
import {withRouter, Link} from "react-router-dom";


class Lobby extends Component {

    constructor(props) {
        super(props);
    }



    placeStartButton() {
        if (this.props.admin) {
            return (<button onClick={this.props.start}><b>Start</b></button>)
        }
    }

    render() {

        let names = this.props.players.map((e) => <p key={this.props.players.indexOf(e)}>{e}</p>);

        return (
            <div>
                {this.placeStartButton()}
                <label>Players</label>
                <div>
                    <div>Numbers of players: {names.length}</div>
                    <div>
                        {names}
                    </div>

                </div>
            </div>
        );
    }

}


export default withRouter(Lobby)