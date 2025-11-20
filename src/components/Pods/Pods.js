import React from "react";

function Pods(props) {
  console.log(props.data, "to show fields in the console");
  return (
    <div className="container">
      <h2 className="ms-3 mb-n5">Pods</h2>
      <div className="row padding-screen">
        {props.data.map((value, index) => {
          return (
            <>
              <div className="col-lg-4 col-md-4 col-sm-12 mb-4 ">
                <div className="card mt-4 pods-cards-shadow cursor h-100 ">
                  <img
                    src={value.img}
                    className="card-img-top pods-image"
                    alt="Meetings"
                  />
                  <div className="card-body">
                    <h3 className="h2-heading">{value.title}</h3>
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
  );
}

export default Pods;
