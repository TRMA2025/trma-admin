import { Icon } from "@iconify/react";
import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, ListItemButton, Tooltip } from "@mui/material";

// ----------------------------------------------------------------------

export default function CustomPopoverSectionItems(props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { item, data, setOpen } = props;

  const handleClickDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  return (
    <>
      <Tooltip
        title={
          item.label === "Delete" && data?.is_builtin
            ? "You cannot delete the default section"
            : ""
        }
        arrow
      >
        <span>
          {" "}
          {/* Wrapper to allow tooltip on disabled elements */}
          <ListItemButton
            key={item.label}
            onClick={(e) => {
              if (item.label === "Delete" && data?.is_builtin) {
                return; // Prevent click for restricted rows
              }
              if (item.child_options) {
                handleClickDropdown();
              } else {
                e.preventDefault();
                setOpen(false);
                item.handleClick(data);
              }
            }}
            className="d-block"
            disabled={item.label === "Delete" && data?.is_builtin} // Disables ListItemButton
          >
            {item.icon && (
              <Icon
                fontSize="20"
                style={{
                  color:
                    item.label === "Delete" && data?.is_builtin
                      ? "#B0B0B0" // Gray color for disabled delete icon
                      : "#9F00FF",
                }}
                className="me-2"
                icon={
                  item.label === "Delete" && data?.is_builtin
                    ? "mdi:delete-off" // Use a disabled delete icon
                    : item.icon
                }
              />
            )}
            <span className="normal-font">{item.label}</span>
            <span className="menu-dropdown-icon">
              {item.child_options &&
                (openDropdown ? <ExpandLess /> : <ExpandMore />)}
            </span>
          </ListItemButton>
        </span>
      </Tooltip>

      {item.child_options && item.child_options.length > 0 && (
        <Collapse in={openDropdown} timeout="auto" unmountOnExit>
          {item.child_options.map((child_option, index) => {
            return (
              <ListItemButton
                key={index}
                className="menus-child-items"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  child_option.handleClick(data);
                }}
              >
                {child_option.icon && (
                  <Icon
                    fontSize="18"
                    style={{ color: "#9f00ff" }}
                    className="me-2"
                    icon={child_option.icon}
                  />
                )}
                <span>{child_option.label}</span>
              </ListItemButton>
            );
          })}
        </Collapse>
      )}
    </>
  );
}
