import React,{ useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid';
import Papa from 'papaparse';
import * as moment from 'moment'
export  default function UpladJSON(props) {
    const [showDb, setShowDb] = useState(false);
    const [euroRate, seteuroRate] = useState([])
    const addNotes = () => {
      const note = euroRate;
      props.onAdds(note);
  }
  const closeForm = () => {
    seteuroRate([]);
    setShowDb(false)
  }

  const fetchCurrencyData = (
    prev, current, date,
    spotPrice,
    quantity,
    coin,
    price,
    currency,
    type) => {
    // https://api.nbp.pl/api/exchangerates/rates/a/eur/2024-02-25/2024-02-27/?format=json

    fetch(`https://api.nbp.pl/api/exchangerates/rates/a/eur/${prev}/${current}/?format=json`)
      .then(response => {
          if(response.status >= 400) {
              throw new Error("Server responds with error!");
          }
      return response.json()
      })
      .then(data => {
        let res =data.rates.at(data.rates.length-2).mid;
        seteuroRate(s => [
          ...s, {
          date,
          spotPrice,
          quantity,
          coin,
          price,
          currency,
          type,
          plntax:Number(res).toFixed(2)
            }
          ]);

      },
      err => {
          console.log(err)
      })
}
let arr = []

//CHECK DUPLICATE TRANSACTION PRICE

    const changeHandler = (e) => { 
      let jsonArr = [];
        Papa.parse(e.target.files[0], {
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,

            complete: function (results) {
              results.data.splice(0, 2);
              results.data.forEach(function(e, i) {
                  if(e[2]=='Sell'||e[2]=='Buy'||e[2]=='Advance Trade Sell'||e[2]=='Advance Trade Buy') {
                    jsonArr.push(e);
                              let newDate = moment(new Date(String(e[1]).split(' ')[0])).format('DD.MM.YYYY');
                              let hdate = newDate.split('.');
                              let changedate = hdate[2]+'-'+hdate[1]+'-'+hdate[0];
                              if(hdate[0].length==1) {
                                changedate = hdate[2]+'-'+hdate[1]+'-0'+hdate[0];
                            }
                            let q = new Date(Date.parse(changedate));
                            q.setDate(q.getDate() - 2);
                            let vdate = q.toLocaleString().split(',')[0].split('.');
                            let convertdate = vdate[2]+'-'+vdate[1]+'-'+vdate[0];
                            if(vdate[0].length==1) {
                                  convertdate = vdate[2]+'-'+vdate[1]+'-0'+vdate[0];
                            }
console.log(e[1])
                    fetchCurrencyData(
                        convertdate,
                        changedate,
                        newDate,
                        e[6],
                        e[4],
                        e[3],
                        e[8],
                        e[5],
                        e[2],
                        e[9]
                      )

                  }
              });
              setShowDb(true)
              console.log(results.data)


            },
          });

      };

    const handleChange = e => {
      const fileReader = new FileReader();
      if(e.target.files.length>0) {
        fileReader.readAsText(e.target.files[0], "UTF-8");
      }
      fileReader.onload = e => {
        seteuroRate([]);
        arr =  JSON.parse(e.target.result);
        // CHECK JSON!
        // Iterate over array
            arr.forEach(function(e, i) {
           
                Object.keys(e).forEach(function(key) {
                var val = e[key],
                    nK = key.replace(/\s+/g, '_')||'';
                    nK = nK.replace('_(inclusive_of_fees_and/or_spread)','')||'';
                    nK = nK.replace('/','')||''
                delete arr[i][key];
                arr[i][nK] = val;
                });
            });

		
        for(let i = 0; i < arr.length; i++) {
            let obj = arr[i];
      
            let newDate = obj.hasOwnProperty('Timestamp')?moment(new Date(String(obj.Timestamp).split(' ')[0])).format('DD.MM.YYYY'):obj.date
            let hdate = newDate.split('.');
            let changedate = hdate[2]+'-'+hdate[1]+'-'+hdate[0];
            if(hdate[0].length==1) {
              changedate = hdate[2]+'-'+hdate[1]+'-0'+hdate[0];
          }
          let q = new Date(Date.parse(changedate));
          q.setDate(q.getDate() - 2);
          let vdate = q.toLocaleString().split(',')[0].split('.');
          let convertdate = vdate[2]+'-'+vdate[1]+'-'+vdate[0];
          if(vdate[0].length==1) {
                convertdate = vdate[2]+'-'+vdate[1]+'-0'+vdate[0];
          }
            fetchCurrencyData(
                convertdate,
                changedate,
                newDate,
                obj.hasOwnProperty('Spot_Price_at_Transaction')?String(obj.Spot_Price_at_Transaction):obj.spotPrice,
                obj.hasOwnProperty('Quantity_Transacted')?String(obj.Quantity_Transacted):obj.quantity,
                obj.hasOwnProperty('Asset')?String(obj.Asset):obj.coin,
                obj.hasOwnProperty('Total')?String(obj.Total):obj.price,
                obj.hasOwnProperty('Spot_Price_Currency')?String(obj.Spot_Price_Currency):'EUR',
                obj.hasOwnProperty('Transaction_Type')?String(obj.Transaction_Type):obj.type,
                obj.hasOwnProperty('Fees_andor_Spread')?String(obj.Fees_andor_Spread):''
              )
        }
        setShowDb(true)
      };
    };
    return (
      <div className="uploadCont col-md-6">
        <h3>Upload orders file</h3>

        <label className="custom-file-upload">
          <input type="file" onChange={handleChange} accept=".json"/>
          Upload JSON file
        </label>

        <label className="custom-file-upload">
            <input type="file" name="file" accept=".csv" 
            onChange={changeHandler}
          />
          Upload CSV file
        </label>


        {showDb ?(
          <div className="uploadOrders">
            <ul key={uuidv4()} className="rates">
            {euroRate.map(o => (
              <li className="trans" key={uuidv4()}>
                coin: {o.coin} <br/> 
                order type:{o.type} <br/> 
                coin spot price: {o.spotPrice} <br/> 
                quantity: {o.quantity} <br/> 
                price: {o.price} <br/> 
                order date: {o.date} <br/></li>
            ))}
          </ul>
          <button className="cta2" onClick={()=> addNotes()}>Upload to database</button>
          <button className="cta2 closecta" onClick={()=> closeForm()}>Close form</button>
        </div>
        ):(null)}
   
      </div>
    );
  }