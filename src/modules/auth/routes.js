// import lib
import Loadable from 'react-loadable'

// import components
import LoadingComponent from '../../components/common/loader'


const _routes = [
  {
    path: '/login',
    exact: true,
    auth: false,
    roles: ["user","admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/login'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/register',
    exact: true,
    auth: false,
    roles: ["user","admin", "superadmin"],
    component: Loadable({
      loader: () => import('./pages/register'),
      loading: LoadingComponent,
    }),
  },
]

export default _routes;