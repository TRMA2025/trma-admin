import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// components
import MenuPopover from "../MenuPopover";
import { get_root_value } from "src/utils/domUtils";
import CustomPopoverSectionItems from "./CustomPopoverSectionItems";
import { PhotoCamera } from "@mui/icons-material";

// ----------------------------------------------------------------------

export default function EditPhoto(props) {
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
      // className="remove-border menu-background-circle"
    >
      <PhotoCamera
        sx={{ width: 20, height: 20 }}
        className="pointer custom-popover-icon camera"
        ref={anchorRef}
        onClick={handleOpen}
      />
      <MenuPopover
        className="custom-popover"
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ marginLeft: 1.8, maxHeight: 300 }}
      >
        {menu.map((option) => (
          <CustomPopoverSectionItems
            item={option}
            data={data}
            setOpen={setOpen}
          />
        ))}
      </MenuPopover>
    </div>
  );
}
