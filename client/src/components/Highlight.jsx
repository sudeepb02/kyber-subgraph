import React from "react";
import NumberFormat from 'react-number-format';

function Highlight({ label, value }) {
  return (
    <div className="highlight d-flex my-2">
      <div className="d-flex flex-column">
        <div className="highlight-label d-flex">{label}</div>
        <div className="highlight-value d-flex">
            <NumberFormat thousandSeparator={true} value={value} />    
            </div>
      </div>
    </div>
  );
}

export default Highlight;
