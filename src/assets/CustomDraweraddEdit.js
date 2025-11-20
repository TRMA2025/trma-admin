import React from "react";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import { Stack, Drawer, Divider, IconButton, Typography } from "@mui/material";

export default function CustomDrawerAddEdit({
  isOpenDrawer,
  onCloseDrawer,
  componentToPassDown,
  pageTitle,
}) {
  const drawerWidth = 290;

  return (
    <>
      <Drawer
        className={`forms-drawer ${drawerWidth ? "custom-drawer-width" : ""}`}
        anchor="right"
        open={isOpenDrawer}
        onClose={onCloseDrawer}
        PaperProps={{
          sx: { border: "none", overflow: "hidden" },
        }}
      >
        <div className="custom-drawer-header">
          <h6 className="drawer-title">{pageTitle}</h6>
          <IconButton className="drawer-cross-icon" onClick={onCloseDrawer}>
            <Icon icon={closeFill} width={21} height={21} />
          </IconButton>
        </div>
        <Divider className="sidebar-divider" />
        <div className="custom-drawer-content">{componentToPassDown}</div>
      </Drawer>
    </>
  );
}
