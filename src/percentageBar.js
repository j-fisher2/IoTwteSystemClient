import React from "react";

const PercentageBar = ({ percentage }) => {
  let backgroundColor;
  console.log(percentage);
  percentage = Math.min(Number(percentage), 100);
  if (percentage <= 50) {
    backgroundColor = "#008000";
  } else if (percentage <= 80) {
    backgroundColor = "#FFD637";
  } else {
    backgroundColor = "red";
  }

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "5px",
        height: "30px",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: backgroundColor,
          height: "100%",
          borderRadius: "5px",
        }}
      ></div>
    </div>
  );
};

export default PercentageBar;
