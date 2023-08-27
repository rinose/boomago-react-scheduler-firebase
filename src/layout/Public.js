//import libs
import React from 'react'
import PropTypes from 'prop-types'

// import components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: "rgb(242,242,242)"
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'fixed'
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  title: {
    color: "#ffffff"
  }
}));



const propTypes = {
  children: PropTypes.node.isRequired,
}

function PublicLayout({children}) {
  const classes = useStyles();
  return <div>
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
          <Link to="/">
            Boomago
            </Link>
          </Typography>
          <Button href="#pricing" color="primary" variant="outlined" className={classes.link}>
            Pricing
          </Button>
          <Button href="/login" color="primary" variant="outlined" className={classes.link}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
          {children}
  </div>
}

PublicLayout.propTypes = propTypes

export default PublicLayout
