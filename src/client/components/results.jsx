import React, {Component} from 'react';

class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            data: props.data
        }
    }

    render() {
        let i = 0;
        return (
            <div className={""}>
                <label className={"text-justify text-center"} htmlFor={this.state.name} >{this.state.name}</label>
                <table className={"table-striped"} id={this.state.name}>
                    <thead>
                    <tr>
                        {Object.keys(this.state.data[0]).map(x => {
                            return (<th key={x+i++}>{x}</th>)
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data.map(y => {
                            return (<tr key={y._id+i++}>
                                {Object.values(y).map(x => {
                                    return (<td key={x+i++}>{x}</td>)
                                })}
                            </tr>)
                        })
                    }
                    </tbody>
                    {console.log('done')}
                </table>
            </div>
        )
    }
}

export default Results;