// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/apisquid';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login')
};

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  rule: {
    root: path(ROOTS_DASHBOARD, '/rule'),
    list: path(ROOTS_DASHBOARD, '/rule/list'),
    newRule: path(ROOTS_DASHBOARD, '/rule/new')
  },
  log: {
    root: path(ROOTS_DASHBOARD, '/log'),
    elk: path(ROOTS_DASHBOARD, '/log/elk')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
