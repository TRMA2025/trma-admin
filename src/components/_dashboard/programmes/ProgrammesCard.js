import PropTypes from "prop-types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// material
import { Box, Card, Link, Typography, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
// utils
import { fCurrency } from "../../../utils/formatNumber";
//
import Label from "../../Label";
import ColorPreview from "../../ColorPreview";

// ----------------------------------------------------------------------

const ProgrammesImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

ProgrammesCard.propTypes = {
  product: PropTypes.object,
};

export default function ProgrammesCard({ program }) {
  const navigate = useNavigate();
  console.log(program, "from ");
  return (
    <>
      {program.map((program, index) => {
        <Card
          key={index}
          className="programm-card h-100"
          sx={{ cursor: "pointer" }}
          onClick={() =>
            navigate(
              `/programmes/programmes_detail/48ce0817-9219-4977-9149-168e020ad288`,
              { state: program }
            )
          }
        >
          <Box sx={{ pt: "100%", position: "relative", cursor: "pointer" }}>
            {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )} */}
           
          </Box>

          <Stack spacing={2} className="programme-content">
            {/* <Link to="#" color="inherit" underline="hover" component={RouterLink}> */}
            <h3>{name}</h3>
            {/* </Link> */}
            <p className="programme-card-desc">{program.short_description}</p>

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={colors} />
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack> */}
            {/* <div
          className="card-button"
          //  style={{ position: 'absolute', bottom: 15, width: '92%', textAlign: 'center' }}
        >
          <Button
            variant="contained"
            color="warning"
            // fullWidth
            style={{ width: 200 }}
            onClick={() => navigate(`/programmes/programmes_detail/${id}`, { state: product })}
          >
            WATCH
          </Button>
        </div> */}
            <div className="card-button">
              <p className="programme-duration">
                <span>5 Lessons &nbsp; | &nbsp; 5 hr 16 min 19 sec</span>
              </p>
            </div>
          </Stack>
        </Card>;
      })}
    </>
  );
}
