import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import {
  Link,
  Container,
  TextField,
  Grid,
  IconButton,
  CircularProgress,
  Button,
  Typography,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Dialog
} from '@mui/material';
import Switch from '@mui/material/Switch';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { updateProfile, profileDetail, updateAdminPassword } from '../DAL/Login/Login';
import { departmentList } from '../DAL/Department/Department';
import { baseUri } from '../config/config';

const useStyles = makeStyles(() => ({
  img: {
    width: '100%'
  },
  loading: {
    marginLeft: '50%',
    marginTop: '20%'
  }
}));

function UserProfile(props) {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setIswaiting] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [Image, setimage] = React.useState('');
  const [file, setProfileImage] = React.useState('');
  const [status, setStatus] = useState(true);
  const [opendialog, setOpenDialog] = React.useState(false);

  const handleOpenDialig = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let _status;
    if (status === true) {
      _status = 1;
    } else {
      _status = 0;
    }
    setIswaiting(true);
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if (Image) {
      formData.append('user_image', Image);
    }
    formData.append('token', localStorage.getItem('token'));
    const result = await updateProfile(formData);
    if (result.code === 200) {
      setIswaiting(false);
      fetchProfileDetail();
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
      setIswaiting(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('Password and Confirm Password not Match', { variant: 'error' });
      return;
    }
    setIswaiting(true);
    const formData = new FormData();
    formData.append('new_password', newPassword);
    formData.append('confirm_password', confirmPassword);
    formData.append('token', localStorage.getItem('token'));
    const result = await updateAdminPassword(formData);
    if (result.code === 200) {
      handleCloseDialog();
      setIswaiting(false);
      fetchProfileDetail();
      enqueueSnackbar('Password Updated Successfully', { variant: 'success' });
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
      setIswaiting(false);
    }
  };

  const fileChangedHandler = async (e) => {
    // setiswaiting(true);
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setimage(e.target.files[0]);
    // let formData = new FormData(); //formdata object
    // formData.append("directory", "images/");
    // formData.append("image", e.target.files[0]);
    // const upload_image_resp = await upload_image(formData);
    // console.log(upload_image_resp);
    // setimage(upload_image_resp.path);
    // if(upload_image_resp.code == 200){
    //   setiswaiting(false);
    // }
  };

  const fetchProfileDetail = async () => {
    const formData = new FormData();
    formData.append('token', localStorage.getItem('token'));
    const result = await profileDetail(formData);
    if (result.code === 200) {
      setFirstName(result.user_detail.first_name);
      localStorage.setItem('first_name', result.user_detail.first_name);
      setLastName(result.user_detail.last_name);
      localStorage.setItem('last_name', result.user_detail.last_name);
      // setDepartmentData(result.department_list);
      if (result.user_detail.image) {
        setProfileImage(baseUri + result.user_detail.image);
        localStorage.setItem('image', result.user_detail.image);
      }
      // else {
      //   setProfileImage(
      //     'https://www.bastiaanmulder.nl/wp-content/uploads/2013/11/dummy-image-square.jpg'
      //   );
      // }
      setIswaiting(false);
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
      setIswaiting(false);
    }
  };

  useEffect(() => {
    fetchProfileDetail();
  }, []);

  if (iswaiting) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <Container maxWidth="sm">
        <IconButton onClick={() => navigate('/project')}>
          <ArrowBackIcon />
        </IconButton>
        <Link
          onClick={() => handleOpenDialig()}
          variant="subtitle2"
          style={{ float: 'right', cursor: 'pointer' }}
        >
          Change Password
        </Link>
        <Typography variant="h4" sx={{ mb: 5 }} style={{ textAlign: 'center' }}>
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="name"
                label="First Name"
                type="name"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="name"
                label="Last Name"
                type="name"
                fullWidth
                variant="outlined"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                margin="dense"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
              />
            </Grid> */}
            {/* <Grid item xs={12}>
              <TextField
                margin="dense"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <TextField
                margin="dense"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                id="role"
                label="Role"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid> */}
            <Grid item xs={12}>
              {file ? (
                <>
                  {' '}
                  <img className={classes.img} src={file} alt="team member" />{' '}
                </>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/x-png,image/jpeg"
                hidden
                id="contained-button-file"
                multiple
                type="file"
                onChange={fileChangedHandler}
              />
              <label htmlFor="contained-button-file" style={{ display: 'flex' }}>
                <Button
                  component="span"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<DriveFolderUploadIcon />}
                >
                  Upload Image
                </Button>
              </label>
            </Grid>

            {/* <Grid item xs={6}>
              Status :
              <Switch
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Grid> */}
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
        <Dialog open={opendialog} onClose={handleCloseDialog}>
          <IconButton onClick={handleCloseDialog} style={{ marginLeft: 'auto' }}>
            <HighlightOffIcon />
          </IconButton>
          <DialogTitle style={{ textAlign: 'center' }}>Change Password</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmitPassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    margin="dense"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="name"
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="name"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Button variant="contained" type="submit">
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>{/* <Button onClick={handleCloseDialog}>Cancel</Button> */}</DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default UserProfile;
