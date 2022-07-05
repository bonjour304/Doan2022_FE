// material
import { LoadingButton } from '@material-ui/lab';
import { Container } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function SquidProxys() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Log">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Log"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.user.list },
            { name: 'Analytics', href: PATH_DASHBOARD.rule.root },
            { name: 'Elastic Stack' }
          ]}
        />
        <LoadingButton
          variant="contained"
          onClick={() => {
            window.location.href = 'http://14.225.192.34:5601/app/home#/';
          }}
        >
          Visit Elastic Page
        </LoadingButton>
      </Container>
    </Page>
  );
}
