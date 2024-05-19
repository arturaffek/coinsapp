import React,{ useState, useEffect } from "react";

function YearRow({name,buyArr,sellArr}) {
   const buyAll = buyArr.map(a => {
            return (a.year==name)?a.q:0
    });
    const sellAll = sellArr.map(a => {
            return (a.year==name)?a.q:0
    });

const sum = (arr) => (arr.reduce((partialSum, a) => partialSum + a,0)).toFixed(2)
    return (
      <div key={name}>
        <div className="col-md-12">
            <h3>{name}</h3>
            </div>
            <div className="col-lg-6">
            <h4>BUY: {sum(buyAll)} PLN</h4>
            </div>
            <div className="col-lg-6">
            <h4>SELL: {sum(sellAll)} PLN</h4>
            </div>
      </div>
    );
  }

export default YearRow

