import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// import { DeleteQuestion } from "src/DAL/GoalStatement/GoalStatement";
import { useSnackbar } from "notistack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  borderRadius: 1,
  border: 0,
};

export default function DeletedModal({
  getQuestionListing,
  title,
  id,
  open,
  setOpen,
}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    console.log(id, "selected to delete");
    const result = await id;
    if (result.code === 200) {
      getQuestionListing();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {" "}
            Are you sure you want to delete?
          </Typography>
          <Typography id="modal-modal-description"></Typography>
          <div className="text-end mt-2">
            <Button onClick={handleClose}>CANCEL</Button>
            <Button onClick={handleDelete}>AGREE</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
