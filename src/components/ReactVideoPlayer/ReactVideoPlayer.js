// import React, { useLayoutEffect, useState } from "react";
// import ReactPlayer from "react-player";

// export default function ReactVideoPlayer(props) {
//   const [height, setHeight] = useState("");
//   const calculateHeight = () => {
//     if (document.getElementsByClassName("container").length === 0) {
//       return 570;
//     }
//     let height =
//       document.getElementsByClassName("container")[0].offsetWidth / 1.7777;

//     setHeight(height);
//     return height;
//   };

//   useLayoutEffect(() => {
//     calculateHeight();
//   }, []);

//   return (
//     <ReactPlayer
//       controls
//       url={props.url}
//       width="100%"
//       className="custom-video-player"
//       pip
//       stopOnUnmount
//       playsinline
//     />
//   );
// }

import React from "react";
import ReactPlayer from "react-player";

const ReactVideoPlayer = (props) => (
  // <div className="player-wrapper">
  //   <ReactPlayer
  //     url={props.url}
  //     className="react-player"
  //     width="100%"
  //     height="100%"
  //     controls
  //     pip
  //     stopOnUnmount
  //     playsinline
  //   />
  // </div>
  <>
    <div className="radius-wrapper">
      <ReactPlayer
        controls
        className="radius-player"
        url={props.url}
        width="100%"
        height="100%"
        stopOnUnmount
        pip
        playsinline
      />
    </div>
  </>
);

export default ReactVideoPlayer;
