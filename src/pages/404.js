import React from 'react';

import WarningIcon from '@material-ui/icons/WarningRounded';

import BlogLayout from '../layout/BlogLayout';
import BreakOutGame from '@lkoiescg2031/react-breakout';

import SEO from '../components/seo';

const NotFoundPage = () => (
  <BlogLayout>
    <SEO title="404: Not found" />
    <WarningIcon style={{ fontSize: '75px' }} color="error" />
    <h1>404: 페이지를 찾을 수 없음</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    {/* <BreakOutGame /> */}
  </BlogLayout>
);

export default NotFoundPage;
