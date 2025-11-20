import React, { useState } from "react";
import no_data_found from "../assets/images/no_data_found.png";
export default function RecordNotFound(props) {
  const [delayTime, setDelayTime] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => setDelayTime(true), 500);
  // }, [props]);

  return (
    <>
      <div className="no-access-string">
        <img className="mx-auto" src={no_data_found} />
        <p className="mt-3">{`${props.title} Not Found`}</p>
      </div>
    </>
  );
}
