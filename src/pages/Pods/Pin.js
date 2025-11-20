import React, { useState } from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

const Pin = (props) => {
  //console.log(props);
  return (
    <>
      {/* <div
      style={{
        ...styles.card,
        ...styles[props.size]
      }}
    >
      <img src={props.image} className="profile-image" alt="fireSpot" />
    </div> */}
      <div
        className="card"
        style={{
          ...styles.card,
          ...styles[props.size]
        }}
      >
        <img className="card-img-top" src={props.image} alt="sorry" />
        <div className="card-body">
          <h5 className="card-title">TIR Tuesday Facilitation Call</h5>
          <p className="card-text">Start Time 8pm BST</p>
          <button className="profile-button mb-2">ENTER</button>
        </div>
      </div>
    </>
  );
};
const styles = {
  card: {
    margin: '15px 10px',
    padding: 0,
    borderRadius: '16px',
    backgroundColor: 'white'
  },
  small: {
    gridRowEnd: 'span 26'
  },
  medium: {
    gridRowEnd: 'span 33'
  },
  large: {
    gridRowEnd: 'span 45'
  },
  radius: {
    borderRadius: '16px'
  }
};

export default Pin;
