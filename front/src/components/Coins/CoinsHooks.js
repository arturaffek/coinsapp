import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import Coin from './Coin';
import Modal from 'react-modal';
import Calc from '../calc/calc';
import Download from '../download/download';
import NewCoin from './NewCoin';
import EditCoin from './EditCoin';
import UpladJSON from './upload';
import SearchBar from './SearchBar';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { CoinsArr } from '../MyContext';
import CoinActionsBar from './CoinActionsBar';
import CoinTableSection from './CoinTableSection';
import TaxCalculationSection from './TaxCalculationSection';
import coinApi from '../../services/coinApi'; // Import the new API service

function CoinsHooks(props) {
    // State mirroring the class component's this.state
    const [taxArr, setTaxArr] = useState([]);
    // Removed local notes state as it was unused
    // const [notes, setNotes] = useState([]);
    const [editCoin, setEditCoin] = useState({});
    const [filterText, setFilterText] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Consume CoinsArr context
    const { coinsArr, setcoinsArr } = useContext(CoinsArr);

    // Function to fetch coins - now uses coinApi
    const fetchCoins = useCallback(async () => {
        try {
            const data = await coinApi.fetchCoins();
            setcoinsArr(data);
        } catch (error) {
            // NotificationManager.error is handled in coinApi now
            console.error("Error in fetchCoins from CoinsHooks:", error);
        }
    }, [setcoinsArr]);

    // Mimic componentDidMount for initial data fetch
    useEffect(() => {
        fetchCoins();
    }, [fetchCoins]);

    const addCoinToApi = useCallback(async (coin) => {
        try {
            const newCoinsData = await coinApi.addCoinToApi(coin);
            setcoinsArr(prevCoins => {
                if (Array.isArray(newCoinsData)) {
                    return [...prevCoins, ...newCoinsData];
                } else {
                    return [...prevCoins, newCoinsData];
                }
            });
        } catch (err) {
            // NotificationManager.error is handled in coinApi now
            console.error("Error in addCoinToApi from CoinsHooks:", err);
        }
    }, [setcoinsArr]);

    const addCoin = useCallback(async (coin) => {
        try {
            // validateAndAddCoin handles both validation and adding to API
            await coinApi.validateAndAddCoin(coin);
            // After successful add, re-fetch coins to ensure state is up-to-date
            // This could be optimized to directly update state if the API returns the new list or item
            fetchCoins(); 
        } catch (err) {
            // NotificationManager.error is handled in coinApi now
            console.error("Error in addCoin from CoinsHooks:", err);
        }
    }, [fetchCoins]);

    const deleteCoin = useCallback(async (id) => {
        try {
            await coinApi.deleteCoin(id);
            setcoinsArr(prevCoins => prevCoins.filter(coin => coin._id !== id));
        } catch (err) {
            // NotificationManager.error is handled in coinApi now
            console.error("Error in deleteCoin from CoinsHooks:", err);
        }
    }, [setcoinsArr]);

    const handleEditCoinSubmit = useCallback(async (coin) => {
        try {
            await coinApi.editCoin(coin);
            setcoinsArr(prevCoins => {
                const index = prevCoins.findIndex(x => x._id === coin._id);
                if (index >= 0) {
                    const newCoins = [...prevCoins];
                    newCoins[index] = coin;
                    return newCoins;
                }
                return prevCoins;
            });
            setShowModal(false); // Close modal after successful edit
        } catch (err) {
            // NotificationManager.error is handled in coinApi now
            console.error("Error in editCoin from CoinsHooks:", err);
        }
    }, [setcoinsArr]);

    const taxArrCalc = useCallback((data, date, type) => {
        setTaxArr(prevTaxArr => [...prevTaxArr, { data, date, type }]);
    }, []);

    const toggleModal = useCallback(() => {
        setShowModal(prev => !prev);
    }, []);

    const editCoinHandler = useCallback((coin) => {
        setShowModal(true);
        setEditCoin(coin);
    }, []);

    const setFilterTextHandler = useCallback((text) => {
        setFilterText(text);
    }, []);

    // Memoized sorting and filtering logic
    const sortedAndFilteredCoins = useMemo(() => {
        const sortedCoins = [...coinsArr].sort((a, b) => {
            const dateA = a.date.split('.').reverse().join('');
            const dateB = b.date.split('.').reverse().join('');
            return dateA.localeCompare(dateB);
        });

        return sortedCoins.filter(o =>
            o.coin.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [coinsArr, filterText]);

    const rows = useMemo(() => {
        return sortedAndFilteredCoins.map(o => (
            <Coin
                key={o._id}
                id={o._id}
                coin={o.coin}
                type={o.type}
                spotPrice={o.spotPrice}
                quantity={o.quantity}
                price={o.price}
                date={o.date}
                plnTax={o.plntax}
                onEdit={editCoinHandler}
                onDelete={deleteCoin}
                taxArr={taxArrCalc}
            />
        ));
    }, [sortedAndFilteredCoins, editCoinHandler, deleteCoin, taxArrCalc]);

    const buySellArrays = useMemo(() => {
        const sellArr = [];
        const buyArr = [];

        sortedAndFilteredCoins.forEach((o) => {
            if (o.type.includes('Sell')) {
                sellArr.push({
                    year: o.date.split('.')[2],
                    q: +(o.plntax * o.price).toFixed(2)
                });
            } else if (o.type.includes('Buy')) {
                buyArr.push({
                    year: o.date.split('.')[2],
                    q: +(o.plntax * o.price).toFixed(2)
                });
            }
        });
        return { sellArr, buyArr };
    }, [sortedAndFilteredCoins]);

    const { sellArr, buyArr } = buySellArrays;


    return (
        <div>
            <NotificationContainer />
            <Modal
                ariaHideApp={false}
                isOpen={showModal}
                contentLabel="Edit coin"
            >
                <EditCoin
                    coin={editCoin.coin}
                    type={editCoin.type}
                    quantity={editCoin.quantity}
                    price={editCoin.price}
                    spotPrice={editCoin.spotPrice}
                    date={editCoin.date}
                    id={editCoin._id}
                    plntax={editCoin.plntax}
                    onEdit={(coinData) => handleEditCoinSubmit(coinData)}
                />
                <button className='cta disc' onClick={toggleModal}>Discard changes</button>
            </Modal>

            <div className={`datacont show${props.showData}`}>
                <CoinActionsBar
                    coins={coinsArr}
                    addCoinToApi={addCoinToApi}
                    addCoin={addCoin}
                />
                <div className='row'>
                    <CoinTableSection
                        coins={coinsArr}
                        filterText={filterText}
                        onFilterTextChange={setFilterTextHandler}
                        rows={rows}
                    />
                    <TaxCalculationSection
                        buyArr={buyArr}
                        sellArr={sellArr}
                        coins={coinsArr}
                        taxArr={taxArr}
                    />
                </div>
            </div>
        </div>
    );
}

export default CoinsHooks;