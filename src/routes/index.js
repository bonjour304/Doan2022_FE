import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/apisquid');
  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'apisquid',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'rule',
          children: [
            { path: '/', element: <Navigate to="/apisquid/rule/list" replace /> },
            { path: 'list', element: <RuleList /> },
            { path: 'new', element: <RuleCreate /> },
            { path: '/:name/edit', element: <RuleCreate /> }
          ]
        },
        {
          path: 'user',
          children: [
            { path: '/', element: <Navigate to="/apisquid/user/account" replace /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: '/:name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> }
          ]
        },
        {
          path: 'log',
          children: [
            { path: '/', element: <Navigate to="/apisquid/log/elk" replace /> },
            { path: 'elk', element: <ELKAnalytics /> }
          ]
        }
      ]
    },

    // Main Routes
    { path: '/', element: <Navigate to="auth/login" replace /> },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="404" replace /> }
      ]
    }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
// Dashboard
const ELKAnalytics = Loadable(lazy(() => import('../pages/dashboard/Log')));
const RuleList = Loadable(lazy(() => import('../pages/dashboard/RuleList')));
const RuleCreate = Loadable(lazy(() => import('../pages/dashboard/RuleCreate')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// Main
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
