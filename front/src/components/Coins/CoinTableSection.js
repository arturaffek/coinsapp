import React from 'react';
import SearchBar from './SearchBar';
import Coin from './Coin'; // Assuming Coin component is used here

function CoinTableSection({ coins, filterText, onFilterTextChange, rows }) {
    return (
        <div className='col-md-6 first'>
            <SearchBar
                arr={coins}
                filterText={filterText}
                onFilterTextChange={onFilterTextChange}
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
    );
}

export default CoinTableSection;