import Coins from './Coins/Coins';
import React from 'react';

class Front extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showData: false,
            btnText: 'Show sample data'
        }
    }
    toggleData() {
        this.setState({showData: !this.state.showData});
        this.setState({btnText: this.state.showData ? 'Show sample data': 'Hide sample data'});
    }
    render() {
        return (
            <div>
              <div className="hero"> 
              <div className="row"> 
                <div className="claim">
                    <h2>Keep your<br/> crypto organized</h2>
                    <h4>and calculate your tax.</h4>
                    <button className='cta disc' onClick={() => this.toggleData()}>{this.state.btnText}</button>
                </div>
                </div>
                </div>
                    <Coins showData={this.state.showData}/>
            </div>
        )
    }
}
export default Front;
