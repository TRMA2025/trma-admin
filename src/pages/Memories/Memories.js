import React from "react";
import PinterestLayout from "src/components/PinterestLayout/Pinterest";

function Memories(props) {
  const itemData = [];
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <h2 className="quotes-heading pt-1">Memories</h2>
          </div>
          <div className="col-6">
            {/* <button
              className="small-contained-button float-end"
              onClick={handleChange}
            >
              ADD GRATITUDE
            </button> */}
          </div>
        </div>
      </div>
      <PinterestLayout data={itemData} />
    </div>
  );
}

export default Memories;
