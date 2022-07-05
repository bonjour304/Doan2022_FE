import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField } from '@material-ui/core';
// utils
import { createAccount, updateAccount } from '../../../service/authService';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('fullName is required'),
    account: Yup.string().required('account is required'),
    role: Yup.string().required('role is required'),
    password: Yup.string().required('password is required').min(8)
  });

  const UpdateUserSchema = Yup.object().shape({
    fullName: Yup.string().required('fullName is required'),
    account: Yup.string().required('account is required'),
    role: Yup.string().required('role is required'),
    active: Yup.string().required('status is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: !isEdit
      ? {
          fullName: currentUser?.fullName || '',
          account: currentUser?.account || '',
          role: currentUser?.role || 'developer',
          password: ''
        }
      : {
          fullName: currentUser?.fullName || '',
          account: currentUser?.account || '',
          role: currentUser?.role || 'developer',
          active: currentUser?.active ? 'active' : 'inactive'
        },
    validationSchema: !isEdit ? NewUserSchema : UpdateUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (!isEdit) {
          await createAccount(values);
        } else {
          await updateAccount({ ...values, active: values.active === 'active' }, currentUser._id);
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        setSubmitting(false);
        enqueueSnackbar(error.response.data.message || 'Error Happen', { variant: 'error' });
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('fullName')}
                    error={Boolean(touched.fullName && errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                  />
                  <TextField
                    fullWidth
                    label="Account"
                    {...getFieldProps('account')}
                    error={Boolean(touched.account && errors.account)}
                    helperText={touched.account && errors.account}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {!isEdit ? (
                    <TextField
                      fullWidth
                      label="password"
                      {...getFieldProps('password')}
                      type="password"
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  ) : (
                    <TextField
                      select
                      fullWidth
                      label="status"
                      {...getFieldProps('active')}
                      error={Boolean(touched.active && errors.active)}
                      helperText={touched.active && errors.active}
                      placeholder="active"
                      SelectProps={{ native: true }}
                    >
                      {['inactive', 'active'].map((option, i) => (
                        <option key={i} value={option} defaultValue={formik.values.active}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  )}

                  <TextField
                    select
                    fullWidth
                    label="Role"
                    placeholder="role"
                    {...getFieldProps('role')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    {['developer', 'admin'].map((option, i) => (
                      <option key={i} value={option} defaultValue={formik.values.role}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    {!isEdit ? 'Create User' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
