import React,{ useState, useEffect } from "react";


function Coin(props) {
    const [euro, setEuro] = useState([])

    const editHandler = () => {
        props.onEdit({
            coin: props.coin,
            type: props.type,
            quantity: props.quantity,
            price: props.price,
            spotPrice: props.spotPrice,
            date: props.date,
            plntax:props.plnTax,
            _id: props.id
        })
    }

    return(
    <ul key={props.id}>
        <li>{props.coin}</li>
        <li>{props.type}</li>
        <li>{(Number(props.quantity)>1000)?Number(props.quantity):Number(props.quantity).toFixed(2)}</li>
        <li>{props.price}</li>
        <li>{props.spotPrice}</li>
        <li>{props.date}</li>
        <li >{props.plnTax}</li>
        <li >{Number(props.plnTax*props.price).toFixed(2)}</li>

        <span  className='btn' onClick={()=> props.onDelete(props.id)}>
                        <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="59" height="47" rx="23.5" stroke="#330B87" strokeOpacity="0.25"/>
                        <path d="M26.0621 28.7115L25.2881 27.9375L29.2256 24L25.2881 20.0625L26.0621 19.2885L29.9996 23.226L33.9371 19.2885L34.7111 20.0625L30.7736 24L34.7111 27.9375L33.9371 28.7115L29.9996 24.774L26.0621 28.7115Z" fill="#330B87"/>
                        </svg>
        </span>
        <span className='btn edit' onClick={editHandler}>
            EDIT
        </span>

    </ul>
    );
}

export default Coin