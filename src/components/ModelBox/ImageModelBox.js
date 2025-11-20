import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import closeFill from "@iconify/icons-eva/close-fill";
import { get_root_value } from "src/utils/domUtils";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: get_root_value("--sidebars-background-color"),
  border: "1px solid #000",
  boxShadow: 24,
};
const ProgrammesImgStyle = styled("img")({
  height: "auto",
  objectFit: "cover",
  width: "100%",
});
export default function ImageModelBox({ open, handleClose, image_url }) {
  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style} className="mui-btn-close">
          <IconButton onClick={handleClose} className="mui-btn-close-icon">
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
          <ProgrammesImgStyle src={image_url} />
        </Box>
      </Modal>
    </div>
  );
}
