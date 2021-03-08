import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from '@material-ui/core/styles';

import ScrollEffect from './ScrollEffect';
import { Consumer } from './Context.js';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  appbar: {
    borderBottom: `1px solid ${theme.palette.primary.dark}`,
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

function BlogLayoutAppBar(props) {
  const classes = useStyles();
  return (
    <ScrollEffect {...props}>
      <AppBar position="fixed" className={classes.appbar}>
        <Consumer>
          {({ title, toggleDrawer }) => (
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                aria-label="open drawer"
                className={classes.menuButton}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h4" noWrap className={classes.title}>
                {title}
              </Typography>
              <Hidden xsDown implementation="css">
                <Button color="inherit" size="large" href="/Posts">
                  posts
                </Button>
                {/* <Button
                  color="inherit"
                  size="large"
                  onClick={onClicker('/projects')}
                >
                  projects
                </Button> */}
              </Hidden>
              {/* <Hidden implementation="css" smDown>
                <Button
                  color="inherit"
                  size="large"
                  onClick={onClicker('/challenges')}
                >
                  challenges
                </Button>
                <Button
                  color="inherit"
                  size="large"
                  onClick={onClicker('/aboutme')}
                >
                  aboutMe
                </Button>
              </Hidden> */}
            </Toolbar>
          )}
        </Consumer>
      </AppBar>
    </ScrollEffect>
  );
}

BlogLayoutAppBar.propTypes = {};

export default BlogLayoutAppBar;
