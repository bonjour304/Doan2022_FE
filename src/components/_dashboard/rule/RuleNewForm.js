import { FormikProvider, useFormik, Form } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField } from '@material-ui/core';
// utils
import { createRule, updateRule } from '../../../service/authService';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

RuleNewForm.propTypes = {
  isEdit: PropTypes.bool,
  rule: PropTypes.object
};

export default function RuleNewForm({ isEdit, rule }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewRuleSchema = Yup.object().shape({
    rKey: Yup.string().required('rKey is required'),
    rName: Yup.string().required('rName is required'),
    rType: Yup.string().required('rType is required'),
    rValue: Yup.string().required('rValue is required'),
    aKey: Yup.string().required('aKey is required'),
    aType: Yup.string().required('aType is required'),
    aName: Yup.string().required('aName is required')
  });

  const UpdateRuleSchema = Yup.object().shape({
    rKey: Yup.string().required('rKey is required'),
    rName: Yup.string().required('rName is required'),
    rType: Yup.string().required('rType is required'),
    rValue: Yup.string().required('rValue is required'),
    aKey: Yup.string().required('aKey is required'),
    aType: Yup.string().required('aType is required'),
    aName: Yup.string().required('aName is required')
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: !isEdit
      ? {
          rKey: rule?.rKey || 'acl',
          rName: rule?.rName || '',
          rType: rule?.rType || 'dstdomain',
          rValue: rule?.rValue || '',
          aKey: rule?.aKey || 'http_access',
          aType: rule?.aType || 'allow',
          aName: rule?.aName || ''
        }
      : {
          rKey: rule?.rKey || 'acl',
          rName: rule?.rName || '',
          rType: rule?.rType || 'dstdomain',
          rValue: rule?.rValue || '',
          aKey: rule?.aKey || 'http_access',
          aType: rule?.aType || 'allow',
          aName: rule?.aName || ''
        },
    validationSchema: !isEdit ? NewRuleSchema : UpdateRuleSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (!isEdit) {
          await createRule(values);
        } else {
          await updateRule({ ...values }, rule._id);
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.rule.list);
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
                    label="rKey"
                    {...getFieldProps('rKey')}
                    error={Boolean(touched.rKey && errors.rKey)}
                    helperText={touched.rKey && errors.rKey}
                  />
                  <TextField
                    fullWidth
                    label="rName"
                    {...getFieldProps('rName')}
                    error={Boolean(touched.rName && errors.rName)}
                    helperText={touched.rName && errors.rName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="rType"
                    placeholder="rType"
                    {...getFieldProps('rType')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.rType && errors.rType)}
                    helperText={touched.rType && errors.rType}
                  >
                    {['dstdomain', 'src', 'port'].map((option, i) => (
                      <option key={i} value={option} defaultValue={formik.values.rType}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="rValue "
                    {...getFieldProps('rValue')}
                    error={Boolean(touched.rValue && errors.rValue)}
                    helperText={touched.rValue && errors.rValue}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="aKey"
                    {...getFieldProps('aKey')}
                    error={Boolean(touched.aKey && errors.aKey)}
                    helperText={touched.aKey && errors.aKey}
                  />
                  <TextField
                    select
                    fullWidth
                    label="status"
                    placeholder="status"
                    {...getFieldProps('aType')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.aType && errors.aType)}
                    helperText={touched.aType && errors.aType}
                  >
                    {['deny', 'allow'].map((option, i) => (
                      <option key={i} value={option} defaultValue={formik.values.rType}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="aName"
                    {...getFieldProps('aName')}
                    error={Boolean(touched.aName && errors.aName)}
                    helperText={touched.aName && errors.aName}
                  />
                  <TextField
                    fullWidth
                    style={{
                      visibility: 'hidden'
                    }}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    {!isEdit ? 'Create Rule' : 'Save Changes'}
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
