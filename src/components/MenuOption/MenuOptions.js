import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import editFill from "@iconify/icons-eva/edit-fill";
import { Link as RouterLink } from "react-router-dom";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";

import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// ----------------------------------------------------------------------

export default function MenuOption(props) {
  const navigate = useNavigate();
  console.log(props.editObject, "object to be edit");
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          component={RouterLink}
          onClick={props.handleNavigateEdit}
          to={props.path}
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Icon icon="akar-icons:edit" width={24} height={20} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>

        <MenuItem
          component="a"
          sx={{ color: "text.secondary" }}
          onClick={() => props.OnDelete(props.id)}
        >
          <ListItemIcon>
            <Icon icon="ant-design:delete-twotone" width={24} height={20} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        <MenuItem
          component="a"
          sx={{ color: "text.secondary" }}
          onClick={() => navigate(props.detailPath)}
        >
          <ListItemIcon>
            {/* <Icon icon={RemoveRedEyeIcon} width={24} height={24} /> */}
            {/* <RemoveRedEyeIcon /> */}
            <Icon icon="eva:eye-fill" width={24} height={20} />
          </ListItemIcon>
          <ListItemText
            primary="View Detail"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
