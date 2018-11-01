import React, {Component} from "react";
import {withRouter, Link} from "react-router-dom";
import openSocket from 'socket.io-client';


import q from '../data/testq.json'

class Game extends Component {


    constructor(props) {
        super(props);

        this.state = {
            gameId: "something",
            question: q.question,
            answers: q.incorrect_answers,
            correctAnswer: q.correct_answer,
            timer: 10,
            errorMsg: null
        }

    }

    componentDidMount(){

        this.socket = openSocket(window.location.origin,{

        });

        this.socket.on('update',(dto) =>{
            if (!dto) {
                this.setState({errorMsg: "Invalid response from server."});
                return;
            }

            if (dto.error) {
                this.setState({errorMsg: dto.error});
                return;
            }

            const data = dto.data;

            this.setState({
                gameId: data.gameId,
                opponentId: data.opponentId,
                question: data.question,
                answers: data.incorrect_answers,
                correctAnswer: data.correct_answer,
                timer: 10,
            });

            this.socket.on('disconnect', () => {
                this.setState({errorMsg: "Disconnected from Server."});
            });

        })
    }

    // found this here https://stackoverflow.com/questions/8299742/is-there-a-way-to-convert-html-into-normal-text-without-actually-write-it-to-a-s
    decodeHTM(html) {
        let txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    render() {
        let answers = this.state.answers.map((e) => <button key={e}>{e}</button>);
        answers.push(<button key={this.state.correctAnswer}>{this.state.correctAnswer}</button>);

        return (
            <div>
                <p>Timer: {this.state.timer}</p>
                <div><p>{this.decodeHTM(this.state.question)}</p></div>
                <label>Answers</label>
                <div>
                    {answers}
                </div>
            </div>
        );
    }

}


export default withRouter(Game)