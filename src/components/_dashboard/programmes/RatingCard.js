import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";

import { menOne, menTwo } from "../../../assets";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RatingCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ borderRadius: 1 }}>
      {/* <CardHeader
        className="feedback-programme-header"
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        // action={
        //   <div>
        //     <StarIcon color="warning" />
        //     <Typography> 4/5</Typography>
        //   </div>
        // }
        title={<Typography>Nadia El Alaoui</Typography>}
        // subheader="September 14, 2016"
      /> */}
      <div className="row pt-3 ml-0 mr-0">
        <div className="col-12 feedback-programme-header">
          {/* <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar> */}
          <img src={menOne} width="70" height="70" />
        </div>
        <div className="col-12 feedback-programme-header">
          {/* <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar> */}
          <h5 className="feedback-programme-text">Nadia El Alaoui</h5>
        </div>
        <div className="col-12">
          <p className="normal-font ps-3 pe-3">
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </p>
        </div>
        <div className="col-12">
          <Rating
            name="read-only"
            value={5}
            readOnly
            className="rating-stars"
          />
        </div>
      </div>

      {/* <CardContent>
        <p>
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </p>
        
      </CardContent> */}
    </Card>
  );
}
