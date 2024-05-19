import React,{ useState, useEffect } from "react";

function CalcRow({ incomeArr, arr, name, sum }) {
    const [currentSpotPrice, setcurrentSpotPrice] = useState([])

const fetchSpotPrice = (val) => {
        fetch(`https://api.coinbase.com/v2/prices/${val}-EUR/spot`)
        .then(response => {
            if(response.status >= 400) {
                throw new Error("Server responds with error!");
            }
        return response.json();
        })
        .then(data => {
            setcurrentSpotPrice(data.data.amount)
            incomeArr((data.data.amount*qsumBalance-btcTotal).toFixed(2),(data.data.amount*qsumBalance).toFixed(2),name);
        },
        err => {
            console.log(err)
        })
    }
    let allpricbtc = [], 
        allpricbtcSell = [],
        allqbtc = [],
        allqbtcSell = [];
    arr.forEach(function (arrItem) {
        let p = arrItem.price, 
             t = arrItem.type;
        if(arrItem.coin===name&&(t.includes('Buy'))){
            allpricbtc.push(Number(p))
            if(p>5) {
                allqbtc.push(Number(arrItem.quantity))
            }
        } else if(arrItem.coin===name&&(t.includes('Sell'))) {
            allpricbtcSell.push(Number(p))
            allqbtcSell.push(Number(arrItem.quantity)) 
        }
        });

    let btcsum = sum(allpricbtc).toFixed(2),
        btcSell= sum(allpricbtcSell).toFixed(2),
        btcTotal= (btcsum-btcSell).toFixed(2),
        qsum = sum(allqbtc).toFixed(2).replace(/\.0+$/,''),
        qsumSell = sum(allqbtcSell).toFixed(2).replace(/\.0+$/,''),
        qsumBalance = (qsum-qsumSell).toFixed(2),
        avgcost = (qsum>10000)?(btcsum/qsum).toFixed(6):(btcsum/qsum).toFixed(2),
        avgincome = (qsum>10000)?(btcSell/qsumSell).toFixed(6):(btcSell/qsumSell).toFixed(2),
        value= (currentSpotPrice*qsumBalance).toFixed(2),
        allIncome= (currentSpotPrice*qsumBalance-btcTotal).toFixed(2),
        roi = ((allIncome/btcsum)*100).toFixed(2)+'%'
    useEffect(() => {
        fetchSpotPrice(name);
    },[]);
    useEffect(() => {
        incomeArr((currentSpotPrice*qsumBalance-btcTotal).toFixed(2),(currentSpotPrice*qsumBalance).toFixed(2),name);
    },[arr]);

    return (
      <div className="calcRow" key={name}>

            {allpricbtc.length>0||allpricbtcSell.length>0 ?(
                <h2>{name}</h2>
            ):(null)}

            {allpricbtc.length>0 ?(
            <div>
                <h3>Current spot price: {currentSpotPrice} €</h3>
                <h3>BUY</h3>
                <div className='tableCapitions'>
                    <ul>
                        <li>TOTAL COST</li>
                        <li>TOTAL BUY QUANTITY</li>
                        <li>AVG BUY PRICE</li>
                    </ul>
                </div>
                <div className='tableBody'>
                    <ul>    
                        <li>{btcsum}</li>
                        <li>{qsum}</li>
                        <li>{avgcost}</li>
                    </ul>
            </div>
            </div>
            ):(null)}
            {allpricbtcSell.length>0 ?(
            <div>
            <h3>SELL</h3>
            <div className='tableCapitions'>
                <ul>
                    <li>TOTAL SELL INCOME</li>
                    <li>TOTAL SELL QUANTITY</li>
                    <li>AVG SELL PRICE</li>
                </ul>
            </div>
            <div className='tableBody'>
                <ul>    
                    <li>{btcSell}</li>
                    <li>{qsumSell}</li>
                    <li>{avgincome}</li>
                </ul>
            </div>
            </div>
            ):(null)}
            {allpricbtc.length>0||allpricbtcSell.length>0 ?(
            <div>
            <h3 className="balance">BALANCE €</h3>
            <div className='tableCapitions'>
                <ul>
                    <li>COST OF HELD</li>
                    <li>COIN VALUE</li>
                    <li>TOTAL QUANTITY</li>
                    <li>INCOME</li>
                </ul>
            </div>
            <div className='tableBody'>
                <ul>    
                    <li>{btcTotal}</li>
                    <li>{value}</li>
                    <li>{qsumBalance}</li>
                    <li>{allIncome}</li>                 
                </ul>
            </div>
            <h3 className="roiTitle">ROI: {roi}</h3>

            </div>
            ):(null)}
      </div>
    );
  }

export default CalcRow

