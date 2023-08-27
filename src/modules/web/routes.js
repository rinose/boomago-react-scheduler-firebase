// import lib
import Loadable from 'react-loadable'

// import components
import LoadingComponent from '../../components/common/loader'

const routes = [
  {
    path: '/',
    exact: true,
    roles: ["user"],
    component: Loadable({
      loader: () => import('./pages/home'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/dashboard',
    exact: true,
    auth: true,
    roles: ["admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/dashboard'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/services',
    exact: true,
    auth: true,
    roles: ["admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/services'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/users',
    exact: true,
    auth: true,
    roles: ["admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/users'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/resources',
    exact: true,
    auth: true,
    roles: ["admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/resources'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/settings',
    exact: true,
    auth: true,
    roles: ["admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/settings'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/user/booking',
    exact: true,
    auth: true,
    roles: ["user"],
    component: Loadable({
      loader: () => import('./pages/userbooking'),
      loading: LoadingComponent,
    }),
  },
]

export default routes
