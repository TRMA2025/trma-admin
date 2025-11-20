import PropTypes from "prop-types";
import React from "react";
import { Icon } from "@iconify/react";
import { Form, FormikProvider } from "formik";
import closeFill from "@iconify/icons-eva/close-fill";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// material
import {
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
//
import Scrollbar from "../Scrollbar";
// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "priceDesc", label: "Price: High-Low" },
  { value: "priceAsc", label: "Price: Low-High" },
];

// ----------------------------------------------------------------------

CustomDrawer.propTypes = {
  isOpenDrawer: PropTypes.bool,
  onResetDrawer: PropTypes.func,
  onOpenDrawer: PropTypes.func,
  onCloseDrawer: PropTypes.func,
};

export default function CustomDrawer({
  isOpenDrawer,
  onOpenDrawer,
  onCloseDrawer,
  setIsLoading,
  componentToPassDown,
  pageTitle,
  test,
}) {
  return (
    <>
      <FormikProvider>
        <Drawer
          className="forms-drawer event-title"
          anchor="right"
          open={isOpenDrawer}
          onClose={onCloseDrawer}
          PaperProps={{
            sx: {
              width: 280,
              border: "none",
              overflow: "hidden",
              // backgroundColor: "#9f00ff",
            },
          }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, py: 2 }}>
            <Typography className="event-title" variant="h6" sx={{ ml: 1 }}>
              {pageTitle}
            </Typography>
            <IconButton onClick={onCloseDrawer}>
              <Icon icon={closeFill} width={20} height={20} />
            </IconButton>
          </Stack>
          <Divider />
          <Scrollbar>
            <div className="responce-messages">{componentToPassDown}</div>
          </Scrollbar>
        </Drawer>
      </FormikProvider>
    </>
  );
}
