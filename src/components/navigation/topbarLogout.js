import React from 'react'
import FlatButton from 'material-ui/FlatButton';
import { Link } from "react-router-dom";
import { logout } from "../../helpers/auth";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);


const topbarLogout = (
  <div>
    <Link to="/">
      <FlatButton label="Home" style={{color: '#fff'}} />
    </Link>
    <Link to="/dashboard">
      <FlatButton label="dashboard" style={{color: '#fff'}} />
    </Link>
    <span>
    <FlatButton
      label="Logout"
      onClick={() => {
        logout();
      }}
      style={{color: '#fff'}}
    />
    </span>
  </div>
);

export default topbarLogout
