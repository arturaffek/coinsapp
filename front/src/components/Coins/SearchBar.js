import React,{useState} from 'react';

function SearchBar({ arr, onFilterTextChange }) {



  const countBy = (arr, prop) => arr.reduce((prev, curr) => (prev[curr[prop]] = ++prev[curr[prop]] || 1, prev), {});
  let c = countBy(arr,'coin');
  let c2 = countBy(arr,'date');
  let addedrr = Object.keys(c)


  const options = [];

  for (let i = 0; i < addedrr.length; i++) {
    options.push(<option key={addedrr[i]} value={addedrr[i]}>{addedrr[i]}</option>);
  }



    return (
      <form id="searchForm">
      <select name="searchInput" id="searchInput" onChange={(e) => onFilterTextChange(e.target.value)}>
          <option key="All" value="">All</option>
          {options}
      </select>
      </form>
    );
  }

export default SearchBar
