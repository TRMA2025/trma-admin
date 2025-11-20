import * as React from "react";

import { useNavigate } from "react-router-dom";

function Affirmations(props) {
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/affirmations/affirmationList");
  };
  const itemData = [];
  return (
    <>
      {/* <ProgrammesCard /> */}
      {/* <Pods data={itemData} /> */}

      <div className="container">
        <div className="row">
          <div className="col-6">
            <h2 className="quotes-heading">Affirmation</h2>
          </div>
          <div className="col-6">
            <button className="small-contained-button float-end me-3">
              ADD CATEGORY
            </button>
          </div>
        </div>
        <div className="row padding-screen mt-2">
          {itemData.map((value, index) => {
            return (
              <>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div
                    className="card shadow-lg cursor  h-100  pods-image pods-cards-shadow"
                    onClick={handleChange}
                  >
                    <img
                      src={value?.img}
                      className="card-img-top pods-image"
                      alt="Affirmation"
                    />
                    <div className="card-body">
                      <h3 className="card-title h2-heading">{value.title}</h3>
                      <p className="programme-card-desc mb-3">
                        {value.description}
                      </p>
                      <div className="card-button">
                        <p className="pods-active-members">
                          <span>{value.activeMembers}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
      {/* <Affirmationlayout data={itemData} /> */}
    </>
  );
}

export default Affirmations;
