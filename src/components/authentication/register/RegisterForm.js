import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function RegisterForm({ onhandleRegister, isLoading }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const RegisterSchema = Yup.object().shape({
  //   firstName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('First name required'),
  //   lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
  //   email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  //   password: Yup.string().required('Password is required')
  // });

  // const formik = useFormik({
  //   initialValues: {
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     password: ''
  //   },
  //   validationSchema: RegisterSchema,
  //   onSubmit: () => {
  //     navigate('/dashboard', { replace: true });
  //   }
  // });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password, 'email');
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    onhandleRegister(formData);
  };
  // const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    // <FormikProvider value={formik}>
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="First name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            // {...getFieldProps('firstName')}
            // error={Boolean(touched.firstName && errors.firstName)}
            // helperText={touched.firstName && errors.firstName}
          />

          <TextField
            fullWidth
            label="Last name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            // {...getFieldProps('lastName')}
            // error={Boolean(touched.lastName && errors.lastName)}
            // helperText={touched.lastName && errors.lastName}
          />
        </Stack>

        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // {...getFieldProps('email')}
          // error={Boolean(touched.email && errors.email)}
          // helperText={touched.email && errors.email}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // {...getFieldProps('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            )
          }}
          // error={Boolean(touched.password && errors.password)}
          // helperText={touched.password && errors.password}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
          Register
        </LoadingButton>
      </Stack>
    </form>
    // </FormikProvider>
  );
}
