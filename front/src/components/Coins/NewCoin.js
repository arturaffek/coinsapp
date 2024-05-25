import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";

function NewCoin(props) {

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '.' + mm + '.' + yyyy;
    const formattedToday2 = yyyy + '-' + mm + '-' + dd;

    const [showForm, setShowForm] = useState(false);
    const [coin, setCoin] = useState('');
    const [type, setType] = useState('Buy');
    const [spotPrice, setSpotPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [date, setStartDate] = useState(formattedToday);
    const [chdate, setchDate] = useState(formattedToday2)
    const [plntax, setplnTax] = useState([])


    const changeCoin = e => {
        const val = e.target.value;
        setCoin(val)
    }
    const changeType = e => {
        setType(e.target.value)
    }
    const changeSpot = e => {
        const val = e.target.value;
        changeP(quantity,val)
        setSpotPrice(val)
    }
    const changeQ = e => {
        const val = e.target.value;
        changeP(val,spotPrice)
        setQuantity(val)
    }
    const changeP = (quantity,spot) => {
        const val = quantity*spot;
        if(val>0)setPrice(val)
    }
    const changeD = (val) => {
        const dateParts = val.split("-");
        const writeDate = +dateParts[2]+ '.'+dateParts[1]+'.'+dateParts[0];
        setStartDate(writeDate);
        setchDate(val);
    }

    const prevDat = (val) => {
        let q = new Date(Date.parse(val));
            q.setDate(q.getDate() - 3);
        let vdate = q.toLocaleString().split(',')[0].split('.');
        return  (vdate[0].length==1)?vdate[2]+'-'+vdate[1]+'-0'+vdate[0]:vdate[2]+'-'+vdate[1]+'-'+vdate[0];
    }

    const changeDate = (val) => {
        let vdate = val.toLocaleString().split('.');
        return  (vdate[0].length==1)?vdate[2]+'-'+vdate[1]+'-0'+vdate[0]:vdate[2]+'-'+vdate[1]+'-'+vdate[0];
    }

    const fetchCurrencyData = (prev, current) => {
        fetch(`https://api.nbp.pl/api/exchangerates/rates/a/eur/${prev}/${current}/?format=json`)
          .then(response => {
              if(response.status >= 400) {
                  throw new Error("Server responds with error!");
              }
          return response.json()
          })
          .then(data => {
            let res =data.rates.at(data.rates.length-2).mid;
            setplnTax(res);
          },
          err => {
              console.log(err)
          })
    }

    useEffect(() => {
        fetchCurrencyData(prevDat(chdate),changeDate(date))
      }, [chdate])

    const addCoin = () => {
        const ccoin = {coin,type,spotPrice,quantity,price,date,plntax};
        props.onAdd(ccoin);
        let hide = false;
        for(var key in ccoin) {
            if(ccoin[key] === "") {
                hide = true;
            }
        }
       setShowForm(hide)
    }

    return(
        <div className="col-md-6 newCwrap">
     <div className={showForm==false ? "formWrapper hidd" : "formWrapper"}>
            <div className='formcontent'> 
        <div className='formcont'>
		<div className='col-md-3 fcon'>
            <label>Coin:</label>
                <input type='text'
                    value={coin}
                    onChange={changeCoin}
                    ></input>
        </div>
        <div className='col-md-3 fcon'>
            <label>Transaction type:</label>
            <select className="type"
                    name="type"
                    defaultValue="Buy"
                    onChange={changeType}>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
            </select>
        </div>
        <div className='col-md-3 fcon'>
            <label>Spot price:</label>
                <input type='number'
                    value={spotPrice}
                    onChange={changeSpot}
                    ></input> 
            </div> 
            </div> 
        <div className='formcont'>
        <div className='col-md-3 fcon'>               
            <label>Quantity:</label>
                <input type='number'
                    value={quantity}
                    onChange={changeQ}
                    ></input>
         </div>
         <div className='col-md-3 fcon'>
            <label>Price:</label>
                <input type='number'
                    value={price}
                    onChange={changeP}
                    ></input>
        </div>
        <div className='col-md-3 fcon'>
              <label>Date:</label>
              <input type='date'
                    value={chdate}
                    placeholder={chdate}
                    onChange={e => changeD(e.target.value)}
                    ></input>
        </div>
        </div>
        
            <button 
                className='cta' 
                onClick={()=> addCoin()}>Add coin</button>
            <button 
                className='cta closecta' 
                onClick={()=>  setShowForm(false)}>Close form</button>
            </div>
            </div>

            <button 
                className='cta mcta' 
                onClick={()=>  setShowForm(true)}>Add coin</button>
            


            </div>
   

    );
}
export default NewCoin