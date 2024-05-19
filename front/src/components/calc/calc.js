import React,{ useState, useEffect } from "react";
import  CalcRow from './CalcRow';
import  YearRow from './yearRow';

function Calc({coines,buyArr,sellArr}) {
    const [euro, setEuro] = useState([])
    const [incArr, setincomeArr] = useState([])
    const [totalArr, setTotalArr] = useState([])
    const [sumIncome, setsumIncome] = useState(0)
    const [sumTotal, setsumTotal] = useState(0)

      const fetchEuroRate = () => {
	fetch(" https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json")
          .then(response => {
          return response.json()
          })
          .then(data => {
          setEuro(data.rates[0].mid);
          })
	}
    useEffect(() => {
        fetchEuroRate();
    }, [])
    const rows = [];
    const countBy = (arr, prop) => arr.reduce((prev, curr) => (prev[curr[prop]] = ++prev[curr[prop]] || 1, prev), {});
    function sum(ar) { return ar.reduce((a, b) => Number(a) + Number(b), 0) }

    let buyAll =[], sellAll =[],yearRows =[];

    coines.forEach((coin, i) => {
        if(coin.type.includes('Buy')) {
            buyAll.push(coin.price);
        } else if(coin.type.includes('Sell')) {
            sellAll.push(coin.price);
        }
    });

    if(buyArr) {
        let y = countBy(buyArr,'year');
        const years = Object.keys(y);
        if(years.length !== 0) {
            years.forEach((year, i) => {
                yearRows.push(
                <YearRow 
                    key={year}
                    buyArr={buyArr}
                    sellArr={sellArr}
                    name={year}
                />);
            });
        };
    }

    let c = countBy(coines,'coin');

    const keys = Object.keys(c);
    const plnIncome = (sumIncome*euro).toFixed(2);
    const plnSumTotal = (sumTotal*euro).toFixed(2);
    let fetchIncome = (data,total) => {
        setincomeArr(s => [...s, parseInt(data, 10)]);
        setTotalArr(s => [...s, parseInt(total, 10)]);
    }

    useEffect(() => {
       if(incArr.length>=keys.length*2&&incArr.length>0) {
        setincomeArr(incArr.slice(keys.length));
        setTotalArr(totalArr.slice(keys.length));
       } else {
        incArr.reduce((total, obj) => obj.sum + total,0)
        totalArr.reduce((total, obj) => obj.sum + total,0)
            setsumIncome(sum(incArr));
            setsumTotal(sum(totalArr));
       }
    },[incArr,totalArr]);

    if(keys.length !== 0) {
        keys.forEach((key, i) => {
            rows.push(<CalcRow
                key={key}
                incomeArr={fetchIncome}
                arr={coines}
                name={key}
                sum={sum}
                />);
            //    if(c[key]>1) {
            //         rows.push(<Charts key={key+1} name={key} arr={coines}/>);
            //     }
        });
                
        };
    return(
        <div className='calc'>
           {rows}
           <h2>Current summary:</h2>
            <h3>Current Income: {sumIncome} €</h3>
            <h3>Euro/PLN current rate: {euro}</h3>
            <h3>Income in PLN: {plnIncome} PLN</h3>
            <h3>Total in EUR: {sumTotal} €</h3>
            <h3>Total in PLN: {plnSumTotal} PLN</h3>
            <h2>BALANCE FOR TAX</h2>
            {yearRows}
            <h2>BALANCE FOR ALL</h2>
            <h3>SUM BUY: {sum(buyAll)} €</h3>
            <h3>SUM SELL: {sum(sellAll)} €</h3>
            <h3>BALANCE: {sum(sellAll)-sum(buyAll)} €</h3>
        </div>
    );
}

export default Calc
