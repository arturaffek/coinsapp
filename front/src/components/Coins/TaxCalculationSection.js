import React from 'react';
import Calc from '../calc/calc';

function TaxCalculationSection({ buyArr, sellArr, coins, taxArr }) {
    return (
        <div className='col-md-6 second'>
            {/* {tax} - tax state is not present in functional component, verify if needed or derived */}
            <Calc
                buyArr={buyArr}
                sellArr={sellArr}
                coines={coins}
                taxArr={taxArr}
            />
        </div>
    );
}

export default TaxCalculationSection;