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
class Notes extends React.Component {
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

    async addNote(note) {
        const notes = [...this.state.notes];
        //add to api
        try {
            const res = await axios.post('http://localhost:3001/api/notes', note)
            const NewCoin = res.data;
            if(Array.isArray(NewCoin)) {
                Array.prototype.push.apply(notes,NewCoin);
                this.setState({coins: notes})
            } else {
                notes.push(NewCoin);
            }
            this.setState({ notes });
            this.setState({coins: notes})
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    }

    async deleteNote(id) {
        try {
        const notes = [...this.state.notes].filter(note => note._id !== id);
            await axios.delete(`http://localhost:3001/api/notes/${id}`)
            this.setState({notes})
            this.setState({coins: notes})
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    }

    async editNote(note) {
        await axios.put('http://localhost:3001/api/notes/'+note._id, note)
        const notes = [...this.state.notes];
        const index = notes.findIndex(x => x._id === note._id)
        if (index >= 0) {
            notes[index] = note;
            this.setState({notes})
            this.setState({coins: notes})
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
    async fetchNotes() {
        const res = await axios.get('http://localhost:3001/api/notes')
        const notes = res.data;
        this.setState({notes});
        this.setState({coins: notes})
    }
    componentDidMount() {
        this.fetchNotes();
    }
    render() {
        const rows = [],
        sellArr=[],
        buyArr=[];

        let sortOrders = this.state.notes.sort((a, b) => {
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
            rows.push(<Coin
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
                onDelete={(id) => this.deleteNote(id)}
                taxArr={this.taxArrCalc}
                
                />);
        });


        
        return (
            <div>
                <NotificationContainer/>
                <h1>COINS APP</h1>

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
                            onEdit={coin=> this.editNote(coin)}/>
                    <button className='cta disc' onClick={() => this.toggleModal()}>Discard changes</button>
                </Modal>
                <div className='row bottomu'>
                <div className='col-md-6'>
                    <Download coins={this.state.coins}/>
                </div>
                
                    <NewCoin
                        onAdd={(c)=> this.addNote(c)}/>
             
                <div className='col-md-6'>
                <UpladJSON 
                onAdds={(c)=> this.addNote(c)}/>
                </div>
                </div>
                <div className='row'>
                <div className='col-md-6 first'>

                <SearchBar 
                    arr={this.state.notes}
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
        )
    }
}

export default Notes;