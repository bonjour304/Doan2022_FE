// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban'),
  api: getIcon('ic_api'),
  block_ip: getIcon('ic_block_ip')
};

export const sidebarConfigUser = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'Rule',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.api,
        children: [
          { title: 'Rules List', path: PATH_DASHBOARD.rule.list },
          { title: 'Create new Rule', path: PATH_DASHBOARD.rule.newRule }
        ]
      },
      {
        title: 'Log',
        path: PATH_DASHBOARD.log.root,
        icon: ICONS.analytics,
        children: [{ title: 'Elastic Stack', path: PATH_DASHBOARD.log.elk }]
      }
    ]
  }
];

export const sidebarConfigAdmin = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'User List', path: PATH_DASHBOARD.user.list },
          { title: 'Create User', path: PATH_DASHBOARD.user.newUser },
          { title: 'My Account', path: PATH_DASHBOARD.user.account }
        ]
      },
      {
        title: 'Rule',
        path: PATH_DASHBOARD.rule.root,
        icon: ICONS.api,
        children: [
          { title: 'Rules List', path: PATH_DASHBOARD.rule.list },
          { title: 'Create new Rule', path: PATH_DASHBOARD.rule.newRule }
        ]
      },
      {
        title: 'Analytics',
        path: PATH_DASHBOARD.log.root,
        icon: ICONS.analytics,
        children: [{ title: 'Elastic Stack', path: PATH_DASHBOARD.log.elk }]
      }
    ]
  }
];
