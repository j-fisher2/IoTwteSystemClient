import React from 'react';

const PercentageBar = ({ height, BIN_HEIGHT }) => {
  const percentage = Number(height) / BIN_HEIGHT * 100;
  let backgroundColor;
    if (percentage <= 50) {
    backgroundColor = '#00800';
    } else if (percentage <= 80) {
    backgroundColor = '#FFD637';
    } else {
    backgroundColor = 'red';
    }

  return (
    <div style={{ width: '500px', borderRadius: '5px', height: '30px', border: '1px solid black'}}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: backgroundColor,
          height: '100%',
          borderRadius: '5px',
        }}
      ></div>
    </div>
  );
};

export default PercentageBar;
