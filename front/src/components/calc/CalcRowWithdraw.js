import React,{ useState, useEffect } from "react";

function CalcEur({ arr, name }) {
    const [sumTotal, setsumTotal] = useState(0)


    useEffect(() => {
        setsumTotal(arr.reduce((total, obj) => Number(obj.quantity) + total,0))
    },[arr]);

    return (
      <div className="calcRow" key={name}>

                <h2>{name}</h2>
                <h3 className="balance">Total deposit sum: {sumTotal}€</h3>

      </div>
    );
  }

export default CalcEur

