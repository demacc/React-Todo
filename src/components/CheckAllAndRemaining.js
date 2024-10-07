import React from "react";

export default function CheckAllAndRemaining({ remainingCount, CheckAll }) {
  return (
    <div className="check-all-container">
      <div>
        <div className="button" onClick={CheckAll}>
          Check All
        </div>
      </div>

      <span>
        {remainingCount} item{remainingCount > 1 ? "s" : ""} remaining
      </span>
    </div>
  );
}
