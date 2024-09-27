//import libs
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

// import components
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { logout } from '../helpers/auth'
import { LocalStorage } from '../helpers/utils'

import mainListItems from '../components/navigation/leftbar'

const propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object.isRequired
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));


function AdminLayout({ user: User, children }) {

  const lastStructureId = LocalStorage.getCurrentStructureId() !== "null" ? LocalStorage.getCurrentStructureId() : null;

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [currentStructureId, setCurrentStructureId ] = React.useState( lastStructureId );

  /*useEffect(() => { 
    if ((!currentStructureId || currentStructureId === "" || currentStructureId === "null") && User && User.structures && User.structures.length > 0) {
      setCurrentStructureId(User.structures[0].ref.id);
      LocalStorage.setCurrentStructureId(User.structures[0].ref.id);
    }
  }, [User, currentStructureId]);*/

  useEffect(() => {
    if (User.structures && User.structures.length > 0 ) {
      let sid = currentStructureId;
      if (!sid || sid === "" || sid === "null" || sid === null) {
        console.log("sid not found")
        sid = User.structures[0].ref.id;
        console.log("sid", sid)
      }
      const structure = User.structures.find( (structure) => {
        return structure.ref.id === sid;
      });
      if (structure) {
        structure.ref.get().then( (doc) => {
          if (doc.exists) {
            const data = doc.data();
            structure.name = data.name;
            setCurrentStructureId(sid);
            LocalStorage.setCurrentStructure(data);
            LocalStorage.setCurrentStructureId(sid);
          } else {
            console.log("No such document!");
          }
        });
      }
    }
  }, [User.structures, currentStructureId]);


  const handleChangeCurrentStructure = (event) => {
    setCurrentStructureId(event.target.value);
    LocalStorage.setCurrentStructureId(event.target.value);
  };


  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (!User || !User.structures ) {
    return <div>Loading...</div>
  }


  const structuresMenuItems = User.structures.map( (structure) => {
    return <MenuItem key={structure.ref.id} value={structure.ref.id}>{structure.name}</MenuItem>
  });


  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        sid: currentStructureId
      });
    });
  };

  return(
  <div className={classes.root}>
    <CssBaseline />
    <AppBar
      position="absolute" 
      className={clsx(classes.appBar, open && classes.appBarShift)}
      title="Boomago"
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>

        <FormControl size="small" sx={{ mr: 2 }}>
          <InputLabel id="demo-select-small-label">Struttura</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={currentStructureId}
            label="Struttura"
            onChange={handleChangeCurrentStructure}
          >
            {structuresMenuItems}
          </Select>
        </FormControl>
        { (false) &&
          <IconButton color="inherit">
            <Badge overlap="rectangular" badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        }
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        </Typography>
        <Button color="inherit"  onClick={logout}>Logout</Button>
      </Toolbar>
    </AppBar>
    <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
    >
    <div className={classes.toolbarIcon}>
      <IconButton onClick={handleDrawerClose}>
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <Divider />
    <List>{mainListItems}</List>
    </Drawer>
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />
    <Container sid={currentStructureId} maxWidth="lg" className={classes.container}>
    {renderChildren()}
    </Container>
    </main>
  </div>
  )
}

AdminLayout.propTypes = propTypes

export default AdminLayout
