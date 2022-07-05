import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, Card, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { Icon } from '@iconify/react';
import { useState } from 'react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { updatePassword } from '../../../../service/authService';
// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function AccountChangePassword({ id }) {
  const { enqueueSnackbar } = useSnackbar();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ChangePassWordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // await fakeRequest(500);
      await updatePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }, id);
      setSubmitting(false);
      enqueueSnackbar('Save success', { variant: 'success' });
    }
  });

  const handleCurrentShowPassword = () => {
    setShowCurrentPassword((showCurrentPassword) => !showCurrentPassword);
  };
  const handleNewShowPassword = () => {
    setShowNewPassword((showNewPassword) => !showNewPassword);
  };
  const handleConfirmShowPassword = () => {
    setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword);
  };

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            <TextField
              {...getFieldProps('currentPassword')}
              fullWidth
              autoComplete="on"
              type={showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              error={Boolean(touched.currentPassword && errors.currentPassword)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCurrentShowPassword} edge="end">
                      <Icon icon={showCurrentPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText={touched.currentPassword && errors.currentPassword}
            />

            <TextField
              {...getFieldProps('newPassword')}
              fullWidth
              autoComplete="on"
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleNewShowPassword} edge="end">
                      <Icon icon={showNewPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={(touched.newPassword && errors.newPassword) || 'Password must be minimum 8+'}
            />

            <TextField
              {...getFieldProps('confirmNewPassword')}
              fullWidth
              autoComplete="on"
              type={showConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleConfirmShowPassword} edge="end">
                      <Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              label="Confirm New Password"
              error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
              helperText={touched.confirmNewPassword && errors.confirmNewPassword}
            />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
