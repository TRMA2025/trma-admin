import PropTypes from "prop-types";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Form, FormikProvider } from "formik";
import closeFill from "@iconify/icons-eva/close-fill";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  Badge,
  Chip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
//
import Scrollbar from "../../Scrollbar";
import ColorManyPicker from "../../ColorManyPicker";

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "priceDesc", label: "Price: High-Low" },
  { value: "priceAsc", label: "Price: Low-High" },
];
export const PRIORITY_OPTIONS = [
  { label: "Critical", value: "critical", color: "error" },
  { label: "High", value: "high", color: "primary" },
  { label: "Medium", value: "medium", color: "success" },
  { label: "Low", value: "low", color: "info" },
];

const getChipColor = (value) => {
  const chip = PRIORITY_OPTIONS.find((chip) => chip.value === value);
  if (!chip) {
    const chip2 = STATUS_OPTIONS.find((chip) => chip.value === value);
    return chip2.color;
  }
  return chip.color;
};

const getLabel = (value) => {
  const chip = PRIORITY_OPTIONS.find((chip) => chip.value === value);
  if (!chip) {
    const chip2 = STATUS_OPTIONS.find((chip) => chip.value === value);
    return chip2.label;
  }
  return chip.label;
};

export const STATUS_OPTIONS = [
  { label: "Not Started", value: "not_started", color: "success" },
  { label: "In Progress", value: "in_progress", color: "secondary" },
  { label: "In Review", value: "in_review", color: "warning" },
  { label: "Completed", value: "completed", color: "primary" },
  { label: "Cancelled", value: "cancelled", color: "error" },
];
export const FILTER_RATING_OPTIONS = [
  "up4Star",
  "up3Star",
  "up2Star",
  "up1Star",
];
export const FILTER_PRICE_OPTIONS = [
  { value: "below", label: "Below $25" },
  { value: "between", label: "Between $25 - $75" },
  { value: "above", label: "Above $75" },
];
export const FILTER_COLOR_OPTIONS = [
  "#00AB55",
  "#000000",
  "#FFFFFF",
  "#FFC0CB",
  "#FF4842",
  "#1890FF",
  "#94D82D",
  "#FFC107",
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
};

export default function ShopFilterSidebar({
  isOpenFilter,
  isFilterChip,
  isFilterData,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  onFilterData,
  onChangeFilterData,
  // formik
}) {
  // const { values, getFieldProps, handleChange } = formik;
  // const [filterData, setFilterData] = useState({
  //   critical: false,
  //   high: false,
  //   medium: false,
  //   low: false,
  //   not_started: false,
  //   in_progress: false,
  //   in_review: false,
  //   completed: false,
  //   cancelled: false
  // });
  const [filtered, setFiltered] = useState([]);
  const getChecked = (value) => {
    // const result = isFilterData.find((obj) => obj === value);
    // isFilterData.map((x) => {
    //   if (x.key === value) {
    //     console.log(x, 'x checked');
    //     return x.value;
    //   }
    //   return x.value;
    // });
  };

  const handleChangeStatus = (value, key, color) => {
    // setFilterData({
    //   ...filterData,
    //   [key]: value
    // });
    onChangeFilterData(value, key);
  };

  const handleSubmitFilter = () => {
    const arr = [];
    Object.keys(isFilterData).forEach((key) => {
      arr.push({ key, value: isFilterData[key] });
    });
    // setFiltered(arr);
    onFilterData(isFilterData, arr);
    onCloseFilter();
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        {isFilterChip.map((x) => (
          <>
            {x.value === true && (
              <Chip
                // label={
                //   x.key === 'in_progress'
                //     ? 'In Progress'
                //     : x.key === 'not_started'
                //     ? 'Not Started'
                //     : x.key === 'in_review'
                //     ? 'In Review'
                //     : x.key
                // }
                label={getLabel(x.key)}
                color={getChipColor(x.key)}
                style={{ height: 20, marginTop: 8, marginLeft: 5 }}
              />
            )}
          </>
        ))}
        <Button
          disableRipple
          color="inherit"
          endIcon={<Icon icon={roundFilterList} />}
          onClick={onOpenFilter}
        >
          Filters&nbsp;
        </Button>
      </div>

      {/* <FormikProvider value={formik}> */}
      {/* <Form autoComplete="off" noValidate> */}
      <Drawer
        anchor="right"
        open={isOpenFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: "none", overflow: "hidden" },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Priority
              </Typography>
              <FormGroup>
                {PRIORITY_OPTIONS.map((item) => (
                  <FormControlLabel
                    checked={isFilterData[item.value]}
                    key={item}
                    control={
                      <Checkbox
                        // {...getFieldProps('status')}
                        // value={true}
                        // checked={}
                        onChange={(e) =>
                          handleChangeStatus(e.target.checked, item.value)
                        }
                      />
                    }
                    label={item.label}
                  />
                ))}
              </FormGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Status
              </Typography>
              <FormGroup>
                {STATUS_OPTIONS.map((item) => (
                  <FormControlLabel
                    checked={isFilterData[item.value]}
                    key={item}
                    control={
                      <Checkbox
                        // {...getFieldProps('priority')}
                        // value={item.value}
                        // checked={getChecked(item.value)}
                        onChange={(e) =>
                          handleChangeStatus(e.target.checked, item.value)
                        }
                      />
                    }
                    label={item.label}
                  />
                ))}
              </FormGroup>
            </div>

            {/* <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Colour
                  </Typography>
                  <ColorManyPicker
                    name="colors"
                    colors={FILTER_COLOR_OPTIONS}
                    onChange={handleChange}
                    onChecked={(color) => values.colors.includes(color)}
                    sx={{ maxWidth: 36 * 4 }}
                  />
                </div> */}

            {/* <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Price
                  </Typography>
                  <RadioGroup {...getFieldProps('priceRange')}>
                    {FILTER_PRICE_OPTIONS.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </div> */}

            {/* <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Rating
                  </Typography>
                  <RadioGroup {...getFieldProps('rating')}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '& > :first-of-type': { py: 0.5 },
                          '&:hover': {
                            opacity: 0.48,
                            '& > *': { bgcolor: 'transparent' }
                          },
                          ...(values.rating.includes(item) && {
                            bgcolor: 'background.neutral'
                          })
                        }}
                      />
                    ))}
                  </RadioGroup>
                </div> */}
          </Stack>
        </Scrollbar>

        <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={handleSubmitFilter}
            startIcon={<FilterAltIcon />}
          >
            Filter
          </Button>
        </Box>

        <Box sx={{ pl: 3, pr: 3, pt: 3, pb: 1 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetFilter}
            startIcon={<Icon icon={roundClearAll} />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
      {/* </Form> */}
      {/* </FormikProvider> */}
    </>
  );
}
