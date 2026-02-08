import React from 'react';
import Download from '../download/download';
import UpladJSON from './upload';
import NewCoin from './NewCoin';

function CoinActionsBar({ coins, addCoinToApi, addCoin }) {
    return (
        <div className='row bottomu'>
            <div className='col-md-6 firstb'>
                <Download coins={coins} />
            </div>
            <UpladJSON
                onAdds={addCoinToApi} />
            <NewCoin
                onAdd={addCoin} />
        </div>
    );
}

export default CoinActionsBar;