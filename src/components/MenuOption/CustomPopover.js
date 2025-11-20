import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, MenuItem } from "@mui/material";
// components
import MenuPopover from "../MenuPopover";
// import { get_root_value } from "src/utils/domUtils";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function CustomPopover(props) {
  const anchorRef = useRef(null);
  const { menu, data } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{ cursor: "pointer" }}
      className="align-items-center d-flex justify-content-center remove-border menu-background-circle"
    >
      <MoreVertIcon
        style={{
          cursor: "pointer",
          fontSize: 20,
          // color: "white",
        }}
        className="pointer custom-popover-icon"
        ref={anchorRef}
        onClick={handleOpen}
      />
      <MenuPopover
        className="custom-popover"
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 175, marginLeft: 1.8 }}
      >
        {menu.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              setOpen(false);
              option.handleClick(data);
            }}
          >
            {option.icon && (
              <Icon
                fontSize="20"
                style={{ color: "#9F00FF" }}
                className="me-2"
                icon={option.icon}
              />
            )}
            <span className="normal-font">{option.label}</span>
          </MenuItem>
        ))}
      </MenuPopover>
    </div>
  );
}
