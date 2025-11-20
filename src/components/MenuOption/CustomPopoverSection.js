import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// components
import MenuPopover from "../MenuPopover";
import { get_root_value } from "src/utils/domUtils";
import CustomPopoverSectionItems from "./CustomPopoverSectionItems";

// ----------------------------------------------------------------------

export default function CustomPopoverSection(props) {
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
      className="remove-border menu-background-circle">
      <MoreVertIcon
        style={{
          cursor: "pointer",
          fontSize: 20,
          color: "#000",
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
        sx={{ marginLeft: 1.8, maxHeight: 300 }}>
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
