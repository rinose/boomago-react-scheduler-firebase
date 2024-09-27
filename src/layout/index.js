import React from 'react'
//import PropTypes from 'prop-types'
import AdminLayout from './Admin'
import PrivateLayout from './Private'
import PublicLayout from './Public'

const Layout = ({ user: User, children, authed }) => {
  //const location = useLocation();

  //if (authed && (role === "admin" || role === "superadmin")) {
  if (User) {
    return <AdminLayout user={User} authed={authed}>{children}</AdminLayout>
  } else if (authed) {
    return <PrivateLayout user={User} authed={authed}>{children}</PrivateLayout>
  }
  return <PublicLayout authed={authed}>{children}</PublicLayout>
}


Layout.propTypes = {
  //user: PropTypes.object.isRequired,
}


export default Layout