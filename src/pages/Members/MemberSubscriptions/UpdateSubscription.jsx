import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import Autocomplete from "@mui/material/Autocomplete";

import { useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import {
  affiliateSearchInEditMember,
  getSubscriberDetailApi,
  updateSubscriberApi,
} from "src/DAL/member/member";
import { useEffect } from "react";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function UpdateSubscription() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [affiliatesList, setAffiliatesList] = useState([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState({});
  const [inputs, setInputs] = useState({
    plan: "",
    page: "",
  });

  const getSubscriberList = async () => {
    setIsLoading(true);
    const result = await getSubscriberDetailApi(params.id);
    if (result.code === 200) {
      let subscriber = result.event_subscriber;
      setInputs({
        plan: subscriber.plan?.plan_title,
        page: subscriber.page?.sale_page_title,
      });

      if (subscriber.affiliate?.affiliate_user_info) {
        setSelectedAffiliate(subscriber.affiliate);
      }
      getAffiliateListOnSearch();
      setIsLoading(false);
    }
  };
  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setSearchText(value);
  };
  const getAffiliateListOnSearch = async () => {
    let result = await affiliateSearchInEditMember(searchText);
    if (result.code == 200) {
      setAffiliatesList(result?.affiliate);
    } else {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let postData = {
      affilate_id: selectedAffiliate._id,
    };
    setIsLoading(true);
    const result = await updateSubscriberApi(params.id, postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const get_affiliate_name = (option) => {
    let affiliate_name = "";
    if (option.affiliate_user_info) {
      let affiliate = option.affiliate_user_info;
      affiliate_name =
        affiliate.first_name +
        " " +
        affiliate.last_name +
        " (" +
        affiliate.email +
        ")";
      if (affiliate.affiliate_user_created_for == "memberuser") {
        affiliate_name = affiliate_name + " | Member";
      } else {
        affiliate_name = affiliate_name + " | Consultant";
      }
    }
    return affiliate_name;
  };

  useEffect(() => {
    getSubscriberList();
  }, []);

  useEffect(() => {
    if (searchText.length > 2) {
      getAffiliateListOnSearch();
    }
  }, [searchText]);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Edit Subscription</h2>
        </div>
      </div>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Page"
              rows={6}
              name="page"
              value={inputs.page}
              disabled
            />
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Plan"
              rows={6}
              name="plan"
              value={inputs.plan}
              disabled
            />
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <Autocomplete
            id="tags-outlined"
            options={affiliatesList}
            getOptionLabel={(option) => get_affiliate_name(option)}
            filterSelectedOptions
            value={selectedAffiliate}
            onChange={(event, newValue) => {
              setSelectedAffiliate(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Affiliate"
                placeholder="Affiliate"
                onChange={handleSearch}
              />
            )}
          />
        </div>

        <div className="text-end mt-4">
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
}
