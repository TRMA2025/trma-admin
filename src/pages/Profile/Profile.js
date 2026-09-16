import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import profileImg from '../../assets/images/profileImg.png';
import R from '../../assets/images/R.jpeg';

function Profile(props) {
  return (
    <>
      {/* <img src={profileImg} className="mb-4" alt="fireSpot" /> */}
      <h1 className="programmes-heading text-center mb-5">PROFILE</h1>

      <Container>
        <Row>
          <Col className="col-lg-4 col-md-12 col-sm-12 col-12 mb-3">
            <img src={R} className="profile-image" alt="fireSpot" />
          </Col>
          <Col className="col-lg-4 col-md-12 col-sm-12 col-12">
            <div className="profile-details-padding">
              <h4>NAME:</h4>
              <p className="profile-details"> Sajjad Yousaf</p>
              <h4>EMAIL:</h4>
              <p className="profile-details"> sajjad@dlx.com</p>
              <h4>ASSOCIATE:</h4>
              <p className="profile-details"> Ciaran Deeney</p>
              <h4>PHONE:</h4>
              <p className="profile-details"> 03044278167</p>
            </div>
          </Col>
          <Col className="col-lg-4 col-md-12 col-sm-12 ">
            <Row className="profile-button-padding">
              <div className="col-lg-12 col-md-4 col-sm-4 col-6 ">
                <button className="profile-button mb-2">EDIT DETAILS</button>
              </div>
              <div className="col-lg-12 col-md-4 col-sm-4 col-6">
                <button className="profile-button mb-2">BILLING DETAILS</button>
              </div>
              <div className="col-lg-12 col-md-4 col-sm-4 col-6">
                <button className="profile-button mb-2">GOAL STATEMENT</button>
              </div>
              <div className="col-lg-12 col-md-4 col-sm-4 col-6">
                <button className="profile-button mb-2">EDIT PASSWORD</button>
              </div>
              <div className="col-lg-12 col-md-4 col-sm-4 col-6">
                <button className="profile-button mb-2">CHANGE CARD</button>
              </div>
              <div className="col-lg-12 col-md-4 col-sm-4 col-6">
                <button className="profile-button mb-2">TRANSACTIONS</button>
              </div>
            </Row>
          </Col>
          {/* <Col> */}
          <div className="col-lg-12 col-md-12 col-sm-12">
            <h2 className="profile-heading">Billing Profile</h2>
            <p className="profile-details-padding">Payment Request Transaction Information</p>
          </div>
          {/* </Col> */}
        </Row>
      </Container>
    </>
  );
}

export default Profile;
