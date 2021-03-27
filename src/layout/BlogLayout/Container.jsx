import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import BlogLayout from './Layout';

const Container = props => (
  <StaticQuery
    query={graphql`
      {
        allCategory(filter: { parent: { id: { eq: null } } }) {
          edges {
            node {
              name
              postsCnt
              url: relativePath
              absolutePath
              children {
                ... on Category {
                  name
                  postsCnt
                  url: relativePath
                  absolutePath
                  children {
                    ... on Category {
                      name
                      postsCnt
                      url: relativePath
                      absolutePath
                    }
                  }
                }
              }
            }
          }
        }
        allTag {
          nodes {
            name
          }
        }
        site {
          siteMetadata {
            title
            description
            user {
              name
              figure
              email
              github
              twitter
              facebook
              instagram
              linkedIn
              position
            }
          }
        }
      }
    `}
    render={data => (
      <BlogLayout
        {...props}
        title={data.site.siteMetadata.title}
        categories={data.allCategory.edges[0].node}
        tags={data.allTag.nodes.map(({ name }) => name)}
        profile={{
          ...data.site.siteMetadata.user,
          desc: data.site.siteMetadata.description,
        }}
      />
    )}
  ></StaticQuery>
);

export default Container;
