import React,{ useState, useEffect } from "react";

function YearRow({name,buyArr,sellArr}) {

   const buyAll = buyArr.map(a => {
        if(a.year==name) {
            return a.q
        } else {
            return 0
        }
    });
    const sellAll = sellArr.map(a => {
        if(a.year==name) {
            return a.q
        } else {
            return 0
        }
    });

   const sumBuy = (buyAll.reduce((partialSum, a) => partialSum + a,0)).toFixed(2)
   const sumSell= (sellAll.reduce((partialSum, a) => partialSum + a,0)).toFixed(2)
    return (
      <div key={name}>

        <div className="col-md-12">
            <h3>{name}</h3>
            </div>
            <div className="col-lg-6">
            <h4>BUY: {sumBuy} PLN</h4>
            </div>
            <div className="col-lg-6">
            <h4>SELL: {sumSell} PLN</h4>
            </div>
      </div>
    );
  }

export default YearRow

