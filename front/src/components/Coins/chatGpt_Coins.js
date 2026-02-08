import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Coin from './Coin';
import Calc from '../calc/calc';
import Download from '../download/download';
import NewCoin from './NewCoin';
import EditCoin from './EditCoin';
import UploadJSON from './upload';
import SearchBar from './SearchBar';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const Coins = () => {
    const [coins, setCoins] = useState([]);
    const [editCoin, setEditCoin] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [taxArr, setTaxArr] = useState([]);

    useEffect(() => {
        fetchCoins();
    }, []);

    const fetchCoins = async () => {
        try {
            const res = await axios.get(`${REACT_APP_BACKEND_URL}/api/notes`);
            setCoins(res.data);
        } catch (err) {
            NotificationManager.error('Error fetching coins');
        }
    };

    const addCoin = async (coin) => {
        try {
            const res = await axios.post(`${REACT_APP_BACKEND_URL}/api/notes`, coin);
            setCoins(prevCoins => [...prevCoins, res.data]);
        } catch (err) {
            NotificationManager.error(err.response?.data?.message || 'Error adding coin');
        }
    };

    const deleteCoin = async (id) => {
        try {
            await axios.delete(`${REACT_APP_BACKEND_URL}/api/notes/${id}`);
            setCoins(prevCoins => prevCoins.filter(coin => coin._id !== id));
        } catch (err) {
            NotificationManager.error(err.response?.data?.message || 'Error deleting coin');
        }
    };

    const editCoinHandler = (coin) => {
        setEditCoin(coin);
        setShowModal(true);
    };

    const updateCoin = async (coin) => {
        try {
            await axios.put(`${REACT_APP_BACKEND_URL}/api/notes/${coin._id}`, coin);
            setCoins(prevCoins => prevCoins.map(c => (c._id === coin._id ? coin : c)));
            setShowModal(false);
        } catch (err) {
            NotificationManager.error('Error updating coin');
        }
    };

    const toggleModal = () => setShowModal(prev => !prev);

    const filteredCoins = coins.filter(coin => coin.coin.toLowerCase().includes(filterText.toLowerCase()));
    const sortedCoins = [...filteredCoins].sort((a, b) => {
        const dateA = a.date.split('.').reverse().join('-');
        const dateB = b.date.split('.').reverse().join('-');
        return new Date(dateA) - new Date(dateB);
    });

    return (
        <div>
            <NotificationContainer />

            {/* Edit Coin Modal */}
            <Modal isOpen={showModal} ariaHideApp={false} contentLabel="Edit Coin">
                {editCoin && <EditCoin {...editCoin} onEdit={updateCoin} />}
                <button className='cta disc' onClick={toggleModal}>Discard changes</button>
            </Modal>

            <div className='datacont show'>
                <div className='row bottomu'>
                    <div className='col-md-6 firstb'>
                        <Download coins={coins} />
                    </div>
                    <UploadJSON onAdds={addCoin} />
                    <NewCoin onAdd={addCoin} />
                </div>
                
                <div className='row'>
                    <div className='col-md-6 first'>
                        <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
                        <div className='tableCapitions'>
                            <ul>
                                <li>Coin Name</li>
                                <li>Transaction Type</li>
                                <li>Quantity</li>
                                <li>Price</li>
                                <li>Transaction Spot Price</li>
                                <li>Date</li>
                                <li>Euro Rate</li>
                                <li>PLN for Tax</li>
                            </ul>
                        </div>
                        <div className='tableBody'>
                            {sortedCoins.map(coin => (
                                <Coin key={coin._id} {...coin} onEdit={editCoinHandler} onDelete={deleteCoin} />
                            ))}
                        </div>
                    </div>
                    
                    <div className='col-md-6 second'>
                        <Calc coines={coins} taxArr={taxArr} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coins;
