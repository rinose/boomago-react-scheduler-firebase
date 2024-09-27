import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../layout'

const PublicRoutes = ({component: Component, routeAuth, ...rest}) => {

    return <Layout user={null}>
    <Component {...rest} />
    </Layout>
}

PublicRoutes.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default PublicRoutes
