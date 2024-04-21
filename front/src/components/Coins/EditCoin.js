import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";

function EditCoin(props) {
  
    const [coin, setCoin] = useState(props.coin);
    const [type, setType] = useState(props.type);
    const [quantity, setQ] = useState(props.quantity);
    const [price, setPrice] = useState(props.price);
    const [spotPrice, setspotPrice] = useState(props.spotPrice);
    const [date, setStartDate] = useState(props.date);
    const [chdate, setchDate] = useState((props.date).split("."));


    const formatDate = (val) => {
        const placeDate = (val[0].length>1)?+val[2]+ '-'+val[1]+'-'+val[0]:+val[2]+ '-'+val[1]+'-0'+val[0];
        setchDate(placeDate)
    }
    useEffect(() => {
        formatDate(chdate);
    },[]);


    const setDate = (v) => {
        const dParts = v.split("-");
        const wDate = +dParts[2]+ '.'+dParts[1]+'.'+dParts[0];
        setStartDate(wDate)
        setchDate(v);
    }

    const editCoin = () => {
        const EditCoin = {
            coin,type,quantity,price,spotPrice,date,plntax:props.plntax,
            _id: props.id
        }
        props.onEdit(EditCoin)
    }

    return(
        <div className='formcontent'>
            <div className='formcont'>
		    <div className='col-md-3 fcon'>
                <label>Coin name:</label>
                <input type='text'
                    value={coin || ''}
                    onChange={e => setCoin(e.target.value)}
                    ></input>
                    </div>
            <div className='col-md-3 fcon'>
                    <label>Transaction type:</label>
                    <select name="type" id="type" onChange={e => setType(e.target.value)}>
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                    </select>
            </div>
            <div className='col-md-3 fcon'>
                <label>Quantity:</label>
                <input type='number'
                    value={quantity || ''}
                    onChange={e => setQ(e.target.value)}
                    ></input> 
            </div>
            </div>
            <div className='formcont'>
		    <div className='col-md-3 fcon'>
            <label>Price:</label>
                <input type='number'
                    value={price || ''}
                    onChange={e => setPrice(e.target.value)}
                    ></input>
            </div>
            <div className='col-md-3 fcon'>
            <label>Transaction spot price:</label>
                <input type='number'
                    value={spotPrice || ''}
                    onChange={e => setspotPrice(e.target.value)}
                    ></input> 
            </div>
            <div className='col-md-3 fcon'>
            <label>Date:</label>
            <input type='date'
                    dateformat='dd.MM.yyyy'
                    value={chdate}
                    placeholder={chdate}
                    onChange={e => setDate(e.target.value)}
                    ></input>
            </div></div>
            <button 
                className='cta'  
                onClick={()=> editCoin()}>Save changes</button>
            </div>
    );
}

export default EditCoin