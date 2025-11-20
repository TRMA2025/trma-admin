import { useRef, useState } from "react";
import { Menu } from "@mui/material";
import { emoji_picker_icon } from "src/assets";
import EmojiPicker from "./EmojiPicker";

// ----------------------------------------------------------------------

export default function EmojiPickerPopup(props) {
  const anchorRef = useRef(null);
  const { setInput, inputRef, use_field } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let MORE_OPTIONS = {
    previewPosition: "none",
    searchPosition: "none",
    maxFrequentRows: 0,
    perLine: 8,
  };

  return (
    <div>
      <div className="mb-2 event-chat-emoji-picker-button emoji-picker-button-creat-post">
        <img src={emoji_picker_icon} ref={anchorRef} onClick={handleOpen} />
      </div>

      <Menu
        anchorEl={anchorRef.current}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
          className: "emoji-picker-popup",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <EmojiPicker
          use_field={use_field}
          inputRef={inputRef}
          setInput={setInput}
          moreOptions={MORE_OPTIONS}
        />
      </Menu>
    </div>
  );
}
