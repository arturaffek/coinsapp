import Coins from './Coins/Coins';
import { useState, React } from "react";
import  { CoinsArr }  from './MyContext';

function Front() {
    const [coinsArr, setcoinsArr] = useState([]);
    const [showData, setshowData] = useState(false);
    const [btnText, setbtnText] = useState('Show sample data');

    const toggleData= () => {
        setshowData(!showData)
        setbtnText(showData ? 'Show sample data': 'Hide sample data')
    }

    return (
        <div>
        <div className="hero"> 
        <div className="row"> 
          <div className="claim">
              <h2>Keep your<br/> crypto organized</h2>
              <h4>and calculate your tax.</h4>
              <button className='cta disc' onClick={() => toggleData()}>{btnText}</button>
          </div>
          </div>
          </div>
          <CoinsArr.Provider value={{ coinsArr, setcoinsArr }}>
              <Coins showData={showData}/>
            </CoinsArr.Provider>
      </div>
    );
  }
  
  export default Front;





