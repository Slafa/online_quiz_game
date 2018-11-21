import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import openSocket from 'socket.io-client';
import Results from './results'


import q from '../../server/data/testq.json'
import axios from "axios";
import Lobby from "./lobby";

class Game extends Component {


    constructor(props) {
        super(props);

        this.state = {
            userId: props.userId,
            admin: false,
            game: {
                id: null,
                question: null,
                answers: null,
                correctAnswer: null,
                timer: 10,
                rounds: null,
                round: null,
                questions: null
            },
            players: [props.userId],
            started: false,
            errorMsg: null,
            socket : null,
            answered: false,
            results: null
        }

    }

    componentDidMount() {
        this.round = 0;
        const {userId} = this.state;

        if (userId === null) {
            this.setState({errorMsg: "You should log in first"});
            return;
        }

        this.socket = openSocket(window.location.origin);
        this.setState({socket: this.socket});


        this.socket.on('updatePlayer', (dto) => {
            if (this.gotError(dto)) return;

            const data = dto;

            console.log('DATA: '+JSON.stringify(data));
            this.setState({
                game:{
                    id: data.id,
                    question: q.question,
                    answers: q.incorrect_answers,
                    correctAnswer: q.correct_answer,
                    timer: 10
                },
                admin: data.admin,
                players: data.players,
                points: 0,
                btns: {
                    wrongClass:'',
                    correctClass: '',
                    disable: false
                }
            });



        });

        this.socket.on('updateGame', (dto) =>{
            console.log('dto : '+ JSON.stringify(dto));
            console.log('ROUND: ' + this.state.game.round + '/'+ this.state.game.rounds);

            console.log(typeof this.intervalObj);
            if (this.intervalObj !== undefined)clearInterval(this.intervalObj);

            let answers = dto.question.incorrect_answers;
            answers.push(dto.question.correct_answer);
            answers = answers.sort(() => .5 - Math.random());


            this.setState({
               game:{
                   id: this.state.game.id,
                   question: dto.question.question,
                   answers: dto.question.incorrect_answers,
                   correctAnswer: dto.question.correct_answer,
                   timer: dto.timer,
                   rounds: dto.rounds,
                   round: dto.round,
                   questions: answers
               },
               started: dto.hasStarted,
                btns: {
                    wrongClass:'',
                    correctClass: '',
                    disable: false,
                }
           });



             this.intervalObj = setInterval(()=>{
                this.setState({
                    game:{
                        id: this.state.game.id,
                        question: this.state.game.question,
                        answers: this.state.game.answers,
                        correctAnswer: this.state.game.correctAnswer,
                        timer: --this.state.game.timer,
                        rounds: this.state.game.rounds,
                        round: this.state.game.round,
                        questions: this.state.game.questions
                    }
                });
                if (this.state.game.timer <= 0) clearInterval(this.intervalObj);
            },1000)

        });


        this.socket.on(`updateGameInfo`, (dto) =>{
            if (this.gotError(dto)) return;
            const data = dto;
            this.setPlayers(data.players);
            this.startGame(data.hasStarted);
            console.log(dto.players[dto.players-1]+ ' joined the game')
        });

        this.socket.on('points', (dto) =>{
            this.setState({
                points:dto
            })
        });

        this.socket.on('scoreBoard', (dto) =>{
            this.setState({
                results: dto
            })
        });

        this.socket.on('disconnect', () => {
            this.setState({errorMsg: "Disconnected from Server."});
        });

        this.logInWebSocket()
    }

    setPlayers(players){
        this.setState({
            players
        })
    }

    sendStartMessage(){
        this.state.socket.emit('startGame',this.state.game.id)
    }

    startGame(started){
        this.setState({
            started
        })

        //this.socket.emit('startGame', this.state.game.id);
    }

    // found this here https://stackoverflow.com/questions/8299742/is-there-a-way-to-convert-html-into-normal-text-without-actually-write-it-to-a-s
    decodeHTM(html) {
        let txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    gotError(dto){
        if (!dto) {
            this.setState({errorMsg: "Invalid response from server."});
            return true;
        }

        if (dto.error) {
            this.setState({errorMsg: dto.error});
            return true;
        }
        return false;
    }

    registerAnswer(e){
        console.log(e.target.value);

        this.setState({
            btns: {
                wrongClass:'wrong',
                correctClass: 'correct',
                disable: 'disabled'
            }
        });

        this.socket.emit('answer', {
            userId: this.state.userId,
            time: this.state.game.timer,
            answer: e.target.value
        })
    }

    scoreBoard(){
        if(this.state.results === null) return;
        let score = this.state.results.map((x) => {return({player: x.userId, points: x.points})});


        console.log(JSON.stringify(this.state.results));
        return(
            <div>
                <Results name={'Player score'} data={score}/>
                <button onClick={() => this.state.socket.emit('startGame',this.state.game.id)} className={'btn'}>Back to login</button>
            </div>
        )
    }



    render() {
        console.log('inne i game');
        if (!this.state.started) return(<Lobby
            players={this.state.players}
            admin={this.state.admin}
            start={()=>this.sendStartMessage()}

        />);

        let answers = this.state.game.questions.map((e) => {
            if(e === this.state.game.correctAnswer)
                return <button disabled={this.state.btns.disable} className={this.state.btns.correctClass} value={e} onClick={(e) => this.registerAnswer(e)} key={e}>{e}</button>;
            return <button disabled={this.state.btns.disable} className={this.state.btns.wrongClass} value={e} onClick={(e) => this.registerAnswer(e)} key={e}>{e}</button>;
        });

        if (this.state.results !== null) return(this.scoreBoard());


        return (
            <div>
                <p>Round: {this.state.game.round}/{this.state.game.rounds}</p>
                <p>Timer: {this.state.game.timer}</p>
                <p>Points: {this.state.points}</p>
                <div><p>{this.decodeHTM(this.state.game.question)}</p></div>
                <label>Answers</label>
                <div>
                    {answers}
                </div>
            </div>
        );
    }

     logInWebSocket() {
        const url = "/api/V1/wstoken";

        axios.post(url,)
            .then((res) => {

                if (res.status === 401) {
                    this.setState({errorMsg: "You should log in first"});
                    this.props.setUserId(null);
                    return;
                }

                if (res.status !== 201) {
                    this.setState({errorMsg: "Error when connecting to server: status code " + res.status});
                    return;
                }

                this.socket.emit('login', res.data);

            });
    };

}


export default withRouter(Game)