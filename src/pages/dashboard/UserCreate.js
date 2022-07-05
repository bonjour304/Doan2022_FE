import { useEffect, useState } from 'react';
import { capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material

import { Container, Tab, Box, Tabs, Stack } from '@material-ui/core';
// redux
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import { Icon } from '@iconify/react';
import { getDetailAccount } from '../../service/authService';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const isEdit = pathname.includes('edit');
  const [currentTab, setCurrentTab] = useState('general');
  useEffect(() => {
    if (isEdit) {
      const callAPI = async () => {
        const res = await getDetailAccount(name);
        setCurrentUser(res.data.data.data);
      };
      callAPI();
    }
  }, [name, isEdit]);
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <UserNewForm isEdit={isEdit} currentUser={isEdit ? currentUser : {}} />
    }
  ];
  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : currentUser.fullName }
          ]}
        />
        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}
