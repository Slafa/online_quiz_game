import React, {Component} from "react";
import {withRouter} from "react-router-dom";


class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playerNames: ['balle', 'frans', 'kuk', 'pelle'],
            isAdmin: props.isAdmin ? props.isAdmin : false
        }
    }

    placeStartButton() {
        if (this.state.isAdmin) {
            return (<button>Start</button>)
        }
    }

    render() {
        let names = this.state.playerNames.map((e) => <p key={this.state.playerNames.indexOf(e)}>{e}</p>)

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