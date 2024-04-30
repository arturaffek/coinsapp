import React from 'react';
import Coin from './Coin';
import axios from 'axios';
import Modal from 'react-modal';
import Calc from '../calc/calc';
import Download from '../download/download';
import NewCoin from './NewCoin';
import EditCoin from './EditCoin'
import  UpladJSON from './upload';
import  SearchBar from './SearchBar';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL||`http://localhost:3001`;

class Coins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taxArr: [],
            notes: [],
            coins: [],      
            editCoin:{},
            filterText:'',
            showModal: false
        }
    }
    setFilterText(text) {
         this.setState({ filterText: text });
      }

    async addCoin(coin) {
        const coins = [...this.state.coins];
        //add to api
        try {
            const res = await axios.post(`${REACT_APP_BACKEND_URL}/api/notes`, coin)
            const NewCoin = res.data;
            if(Array.isArray(NewCoin)) {
                Array.prototype.push.apply(coins,NewCoin);
                this.setState({coins})
            } else {
                coins.push(NewCoin);
            }
            this.setState({coins})
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    }

    async deleteCoin(id) {
        try {
        const coins = [...this.state.coins].filter(coin => coin._id !== id);
            await axios.delete(`${REACT_APP_BACKEND_URL}/api/notes/${id}`)
            this.setState({coins})
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    }

    async editCoin(coin) {
        await axios.put('${REACT_APP_BACKEND_URL}/api/notes/'+coin._id, coin)
        const coins = [...this.state.coins];
        const index = coins.findIndex(x => x._id === coin._id)
        if (index >= 0) {
            coins[index] = coin;
            this.setState({coins})

        }
            this.toggleModal()       
    }
    editNoteHandler(coin) {
        this.toggleModal();
        this.setState({ editCoin: coin });
      }


    taxArrCalc = (data,date,type) => {
        this.setState({taxArr: [...this.state.taxArr,{data,date,type}]});
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }
    async fetchCoins() {
        const res = await axios.get(`${REACT_APP_BACKEND_URL}/api/notes`)
        const coins = res.data;
        this.setState({coins});
    }
    componentDidMount() {
        this.fetchCoins();
    }
    render() {
        const rows = [],
        sellArr=[],
        buyArr=[];

        let sortOrders = this.state.coins.sort((a, b) => {
            a = a.date.split('.');
            b = b.date.split('.');
            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
            })
        sortOrders.forEach((o) => {
            if (
                o.coin.toLowerCase().indexOf(
                this.state.filterText.toLowerCase()
                ) === -1
              ) {
                return;
              }
        if(o.type.includes('Sell')) {
            sellArr.push({
                year: o.date.split('.')[2],
                q:+(o.plntax*o.price).toFixed(2)
            })
           
        } else if(o.type.includes('Buy')) {
            buyArr.push({
                year: o.date.split('.')[2],
                q: +(o.plntax*o.price).toFixed(2)
            })
        }
            rows.push(
                <Coin
                    key={o._id}
                    id={o._id}
                    coin={o.coin}
                    type={o.type}
                    spotPrice={o.spotPrice}
                    quantity ={o.quantity}
                    price={o.price}
                    date={o.date}
                    plnTax={o.plntax}
                    onEdit={(coin) => this.editNoteHandler(coin)}
                    onDelete={(id) => this.deleteCoin(id)}
                    taxArr={this.taxArrCalc}
                />);
        });


        
        return (
            <div>
                <NotificationContainer/>

                <Modal
                    ariaHideApp={false}
                        isOpen={this.state.showModal}
                        contentLabel="Edit coin">
                        <EditCoin
                            coin={this.state.editCoin.coin}
                            type={this.state.editCoin.type}
                            quantity={this.state.editCoin.quantity}
                            price={this.state.editCoin.price}
                            spotPrice={this.state.editCoin.spotPrice}
                            date={this.state.editCoin.date}
                            id={this.state.editCoin._id}
                            plntax={this.state.editCoin.plntax}
                            onEdit={coin=> this.editCoin(coin)}/>
                    <button className='cta disc' onClick={() => this.toggleModal()}>Discard changes</button>
                </Modal>

       
            <div className={`datacont show${this.props.showData}`}>

                <div className='row bottomu'>
                <div className='col-md-6 firstb'>
                    <Download coins={this.state.coins}/>
                </div>
                <UpladJSON 
                onAdds={(c)=> this.addCoin(c)}/>
                    <NewCoin
                        onAdd={(c)=> this.addCoin(c)}/>
                </div>
                <div className='row'>
                <div className='col-md-6 first'>

                <SearchBar 
                    arr={this.state.coins}
                    filterText={this.state.filterText}
                    onFilterTextChange={(coin)=> this.setFilterText(coin)}
                />
                <div className='tableCapitions'>
                <ul>
                    <li>Coin name</li>
                    <li>Transaction type</li>
                    <li>Quantity</li>
                    <li>Price</li>
                    <li>Transaction spot price</li>
                    <li>Date</li>
                    <li>Euro rate</li>
                    <li>PLN for TAX</li>
                </ul>
                </div>
                <div className='tableBody'>
                    {rows}
                </div>
                </div>
                <div className='col-md-6 second'>
                    {this.state.tax}
                    <Calc 
                    buyArr={buyArr}
                    sellArr={sellArr}
                    coines={this.state.coins}
                    taxArr={this.state.taxArr}
                    />
                </div>
                </div>
            </div>
       

            </div>
        )
    }
}

export default Coins;
