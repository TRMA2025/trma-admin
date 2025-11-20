import React from 'react';
import { Container, Stack, Typography, Divider } from '@mui/material';
import ReactPlayer from 'react-player';
import GoalComments from './GoalComments';

function GoalStatementList(props) {
  return (
    <Container>
      <p className="main-component-heading">Goal Statement</p>
      {/* <p>&nbsp;</p> */}
      <div className="row mt-4">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <ReactPlayer
            controls
            playIcon
            url="https://vimeo.com/226053498"
            width="100%"
            className="custom-video-player"
            pip
            stopOnUnmount
            playsinline
            volume={0}
            muted={0}
          />
        </div>
        <div className="col-12 mt-4 text-center">
          <button
            className="small-contained-button"
            type="button"
            // onClick={() =>
            //   navigate(`/programmes/lessons_card/${location.state.id}`, { state: location.state })
            // }
          >
            Manage Photos
          </button>
        </div>
        <div className="col-12 mt-4">
          <Divider />
        </div>
        {/* <div className="col-12 mt-5">
          <GoalComments />
        </div> */}
      </div>
    </Container>
  );
}

export default GoalStatementList;
