import React, { useEffect, useState } from 'react';
import { Container, Tab, Box, Tabs, Stack } from '@material-ui/core';
import { useLocation, useParams } from 'react-router';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { getDetailRule } from '../../service/authService';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import RuleNewForm from '../../components/_dashboard/rule/RuleNewForm';

const RuleCreate = () => {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const [currentTab, setCurrentTab] = useState('Form');
  const { name } = useParams();
  const [rule, setRule] = useState({});
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    if (isEdit) {
      const callRule = async () => {
        const response = await getDetailRule(name);
        setRule(response.data.data.data, response.data);
      };
      callRule();
    }
  }, [name, isEdit]);
  const ACCOUNT_TABS = [
    {
      value: 'Form',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <RuleNewForm isEdit={isEdit} rule={isEdit ? rule : {}} />
    }
  ];
  return (
    <Page title="Rule: Create a new Rule">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Rule' : 'Edit Rule'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rule.list },
            { name: 'Rule', href: PATH_DASHBOARD.rule.list },
            { name: !isEdit ? 'New Rule' : rule.rName }
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
};

export default RuleCreate;
