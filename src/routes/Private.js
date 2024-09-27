import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Layout from '../layout'

const PrivateRoute = ({component: Component, user: User, ...rest}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!rest.auth) {
            navigate('/login');
        }
    }, [rest, navigate]);

    useEffect(() => {
        if (User && User.id && (!User.structures || User.structures.length === 0)) {
            console.log("PrivateRoute go to structures")
            navigate('/structures');
        }
    }, [User, navigate]);

    if(!User) return null;

    return <Layout user={User}>
    <Component user={User} {...rest} />
    </Layout>

}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  location: PropTypes.object
}

export default PrivateRoute
