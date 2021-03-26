import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import Tags from './Tags';
import { getRandomInt } from '../utils/math';

const usePostStyle = makeStyles(theme => ({
  cardWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  cardRoot: {
    width: '300px',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  cardContent: {
    maxHeight: '260px',
    overflow: 'hidden',
  },
  cardContentWithMedia: {
    maxHeight: '100px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  showButtonRoot: {
    marginLeft: 'auto',
  },
}));

const domParser = new DOMParser();

function Post({ post }) {
  const classes = usePostStyle();

  const imgTagRegExp = /<img[^>]*>?/gm;
  const desc = post.html.replace(imgTagRegExp, '');

  const imgHtmlStrings = post.html.match(imgTagRegExp) || new Array(0);
  const descImgs = imgHtmlStrings.map(imgStr => {
    const $img = domParser
      .parseFromString(imgStr, 'application/xml')
      .getElementsByTagName('img')[0];
    return $img.attributes['src'].value;
  });

  // 대표 이미지가 설정된 경우 사용
  let mediaImage = post.frontmatter.featuredImage;
  if (mediaImage !== null) {
    mediaImage = mediaImage.childImageSharp.fluid.originalImg;
  }
  // 본문안에 이미지가 있는 경우 사용 랜덤 값 사용
  else if (descImgs.length > 0) {
    mediaImage = descImgs[getRandomInt(0, descImgs.length)];
  }

  return (
    <div className={classes.cardWrapper}>
      <Card elevation={3} classes={{ root: classes.cardRoot }}>
        <CardHeader
          title={
            <>
              <Typography align="right" variant="caption">
                <CalendarTodayIcon fontSize="inherit" />
                {new Date(post.frontmatter.date).toLocaleDateString()}
              </Typography>
              <Typography variant="h6">{post.frontmatter.title}</Typography>
              <Tags outlined tags={post.frontmatter.tags} />
            </>
          }
        />
        {mediaImage && (
          <CardMedia
            className={classes.media}
            image={mediaImage}
            title={mediaImage}
          />
        )}
        <CardContent>
          <Typography
            variant="body2"
            classes={{
              root: clsx(classes.cardContent, {
                [classes.cardContentWithMedia]: mediaImage !== null,
              }),
            }}
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="secondary"
            href={post.fields.slug}
            classes={{ root: classes.showButtonRoot }}
          >
            SHOW
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Post;
