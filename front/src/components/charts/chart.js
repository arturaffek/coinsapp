import React,{ useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

class Charts extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        key:props.name, 
        buy: '',
        coinfiltr: ''
      }
    }

    toggleSell() {
      if(this.state.buy==='Buy')
      {
        this.setState({
          buy: 'Sell',
          coinfiltr:[...this.props.arr].filter(coin => (coin.type !== this.state.buy)).filter(coin => (coin.type !== 'Advanced Trade '+this.state.buy)).filter(coin => (coin.coin === this.props.name))
        })
      }
      else {
        this.setState({
          buy: 'Buy',
          coinfiltr:[...this.props.arr].filter(coin => (coin.type !== this.state.buy)).filter(coin => (coin.type !== 'Advanced Trade '+this.state.buy)).filter(coin => (coin.coin === this.props.name))
        })
      }
    }
    componentDidMount() {
      this.setState(
      {
        buy: 'Buy',
        coinfiltr:[...this.props.arr].filter(coin => (coin.type !== this.state.buy)).filter(coin => (coin.type !== 'Advanced Trade '+this.state.buy)).filter(coin => (coin.coin === this.props.name))
      })
    }
    // componentDidUpdate(previousProps) {
    //   if (previousProps.arr !== this.props.arr) {
    //     this.setState({
    //       coinfiltr:[...this.props.arr].filter(coin => (coin.type !== this.state.buy)).filter(coin => (coin.type !== 'Advanced Trade '+this.state.buy)).filter(coin => (coin.coin === this.props.name))
    //     })
    //   }
    // }

  render() {
      return (
        <div className="chartRow" key={this.state.key}>

           <Bar
            data= {{
              labels:[...this.state.coinfiltr].map((data) => data.price),
              datasets: [
              {
                label: 'Advanced Trade '+this.state.buy,
                data: [...this.state.coinfiltr].map((data) => data.spotPrice),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 1
              }  
            ]
            }}
        />
        {/* SELL COUNT AND HIDE WHEN < 1 */}
        <button className="cta" onClick={() => this.toggleSell()}>Change transactions type Buy/Sell</button>

    </div>
      )
  }
}

export default Charts