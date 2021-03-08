import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EmailIcon from '@material-ui/icons/Email';
import GithubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

import { Consumer } from './Context.js';

import Tags from '../../components/Tags';

export const drawerWidth = 280;

const usePostsButtonStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0.5),
    textAlign: 'left',
    textTransform: 'none',
  },
  text: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
  info: {
    marginLeft: 'auto',
  },
}));

const PostsButton = ({ name, info, level, url }) => {
  const classes = usePostsButtonStyle();
  return (
    <Button classes={{ root: classes.root }} href={url}>
      <Typography className={classes.text} variant="body1">
        {`${level > 0 ? '└'.padEnd(level, '─') : ''}\t${name}`}
      </Typography>
      <Chip size="small" variant="outlined" label={info} />
    </Button>
  );
};

PostsButton.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  info: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  drawer: {},
  drawerPaper: {
    width: drawerWidth,
    overflow: 'overlay',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  transParentBackground: {
    backgroundColor: '#00000000',
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: '3px',
  },
  profileRoot: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),

    border: `4px solid ${theme.palette.primary.dark}`,
    backgroundColor: '#fff',

    color: theme.palette.primary.dark,
    fontSize: theme.spacing(6),
  },
  contactWrapper: {
    display: 'flex',
    marginTop: theme.spacing(1),
  },
  contactIcon: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  postsTreeRoot: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
}));

function BlogLayoutDrawer(props) {
  const classes = useStyles();

  return (
    <Consumer>
      {({ isOpenDrawer, toggleDrawer, profile, categories, tags }) => (
        <nav>
          <SwipeableDrawer
            anchor="left"
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            open={isOpenDrawer}
            onOpen={toggleDrawer}
            onClose={toggleDrawer}
          >
            <div className={classes.toolbar}>
              <IconButton
                className={classes.closeButton}
                onClick={toggleDrawer}
              >
                <ArrowBackIosIcon />
              </IconButton>
            </div>
            <Divider />
            {profile && (
              <>
                <div className={classes.profileRoot}>
                  <Avatar
                    alt={profile.name}
                    src={profile.figure}
                    className={classes.avatar}
                  >
                    {typeof profile.figure === 'undefined'
                      ? profile.name
                      : null}
                  </Avatar>
                  <Typography variant="h6" color="inherit">
                    {profile.name}
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    {profile.desc}
                  </Typography>
                  <div className={classes.contactWrapper}>
                    {profile.email && (
                      <IconButton
                        className={classes.contactIcon}
                        href={`mailto:${profile.email}`}
                      >
                        <EmailIcon />
                      </IconButton>
                    )}
                    {profile.github && (
                      <IconButton
                        className={classes.contactIcon}
                        href={profile.github}
                      >
                        <GithubIcon />
                      </IconButton>
                    )}
                    {profile.facebook && (
                      <IconButton
                        className={classes.contactIcon}
                        href={profile.facebook}
                      >
                        <FacebookIcon />
                      </IconButton>
                    )}
                    {profile.twitter && (
                      <IconButton
                        className={classes.contactIcon}
                        href={profile.twitter}
                      >
                        <TwitterIcon />
                      </IconButton>
                    )}
                    {profile.instagram && (
                      <IconButton
                        className={classes.contactIcon}
                        href={profile.instagram}
                      >
                        <InstagramIcon />
                      </IconButton>
                    )}
                    {profile.linkedIn && (
                      <IconButton
                        className={classes.contactIcon}
                        href={profile.linkedIn}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
                <Divider />
                {(function renderPosts(root, level = 0) {
                  return (
                    <React.Fragment key={root.url}>
                      <PostsButton
                        name={root.name}
                        info={root.postsCnt}
                        url={root.url}
                        level={level}
                      />
                      {Array.isArray(root.children)
                        ? root.children.map(child =>
                            renderPosts(child, level + 1),
                          )
                        : null}
                    </React.Fragment>
                  );
                })(categories)}
                <Divider />
                <Button href="/Tags">Tags</Button>
                <Tags align="center" tags={tags} />
                <Divider />
              </>
            )}
          </SwipeableDrawer>
        </nav>
      )}
    </Consumer>
  );
}

export default BlogLayoutDrawer;
