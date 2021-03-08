/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

class CategoryBuilder {
  constructor({ actions, createNodeId, createContentDigest, getNodesByType }) {
    //params
    this.createNode = actions.createNode;
    this.createNodeId = createNodeId;
    this.createContentDigest = createContentDigest;
    this.getNodesByType = getNodesByType;
  }

  build() {
    const allPostPathes = this.getAllPostsPath();

    const categoryObjes = allPostPathes.reduce(
      (finalMaps, postPath) => ({
        ...finalMaps,
        ...this.extractCategory(postPath, finalMaps),
      }),
      {},
    );
    const categoryNodes = this.replaceParent(categoryObjes);
    this.appendChildren(categoryNodes);

    Object.values(categoryNodes).forEach(node => this.createNode(node));
  }

  getAllPostsPath() {
    const allNodes = this.getNodesByType('File');
    const allPosts = allNodes.filter(
      file =>
        file.sourceInstanceName === 'posts' &&
        ['.md', '.mdx'].includes(file.ext),
    );

    return allPosts.map(posts => posts.absolutePath);
  }

  extractCategory(postPath, categoryMaps) {
    const [beforePosts, afterPosts] = postPath.split('/posts/');
    const orderedCateogryNames = ['Posts', ...afterPosts.split('/')];
    orderedCateogryNames.pop();

    let parentPath = beforePosts;

    return orderedCateogryNames.reduce((categories, categoryName) => {
      const currentPath = `${parentPath}/${categoryName}`;

      if (categoryMaps.hasOwnProperty(currentPath) === false) {
        categories[currentPath] = this.createCategoryNode(
          parentPath === beforePosts ? null : parentPath,
          currentPath,
          categoryName,
        );
      } else {
        categoryMaps[currentPath].postsCnt += 1;
      }

      parentPath = currentPath;
      return categories;
    }, {});
  }

  createCategoryNode(parentPath, currentPath, categoryName) {
    const afterPosts = currentPath.split('/Posts/')[1];
    const relativePath = `/Posts${
      typeof afterPosts === 'undefined' ? '' : `/${afterPosts}`
    }`;
    return {
      absolutePath: currentPath,
      relativePath,
      name: categoryName,
      postsCnt: 1,
      id: this.createNodeId(`category-${currentPath}`),
      internal: {
        type: 'Category',
        contentDigest: this.createContentDigest(currentPath),
      },
      parent: parentPath,
      children: [],
    };
  }

  replaceParent(categoryMaps) {
    return Object.values(categoryMaps)
      .map(category => ({
        ...category,
        parent:
          category.parent === null ? null : categoryMaps[category.parent].id,
      }))
      .reduce(
        (finalMaps, category) => ({ ...finalMaps, [category.id]: category }),
        {},
      );
  }

  appendChildren(categoryMaps) {
    Object.values(categoryMaps).forEach(node => {
      const nodeID = node.id;
      const parentID = node.parent;

      if (parentID !== null) {
        categoryMaps[parentID].children.push(nodeID);
      }
    });
  }
}

exports.sourceNodes = param1 => {
  // add categories in graphql
  const categoryBuilder = new CategoryBuilder(param1);
  categoryBuilder.build();
};

exports.onCreateNode = async ({
  node,
  getNode,
  getNodes,
  createNodeId,
  createContentDigest,
  actions,
}) => {
  const { createNodeField, createNode } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({
      node,
      getNode,
      basePath: 'pages',
      trailingSlash: false,
    });
    createNodeField({
      node,
      name: `slug`,
      value: '/Posts' + slug,
    });
    // 테그 생성
    const tags = node.frontmatter.tags || [];
    for (const tag of tags) {
      const found = getNodes().find(
        node => node.internal.type === 'Tag' && node.name === tag,
      );

      if (typeof found === 'undefined') {
        await createNode({
          name: tag,
          id: createNodeId(`Tag-${tag}`),
          internal: {
            type: 'Tag',
            contentDigest: createContentDigest(tag),
          },
        });
      }
    }
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allCategory {
        nodes {
          url: relativePath
        }
      }
      allTag {
        nodes {
          name
        }
      }
      allMarkdownRemark {
        nodes {
          fields {
            url: slug
          }
        }
      }
    }
  `);

  //포스트 카테고리별 페이지 생성
  const toRegexStr = str => {
    return `/${str.replace('+', '\\+')}/`;
  };

  const toEncode = str => {
    return str.replace('#', escape('#'));
  };
  result.data.allCategory.nodes.forEach(node => {
    createPage({
      path: toEncode(node.url),
      component: path.resolve('./src/templates/Category.jsx'),
      context: {
        slug: toRegexStr(node.url),
      },
    });
  });

  //포스트 페이지 생성
  result.data.allMarkdownRemark.nodes.forEach(node => {
    createPage({
      path: node.fields.url,
      component: path.resolve('./src/templates/Post.jsx'),
      context: {
        slug: node.fields.url,
      },
    });
  });

  //테그 페이지 생성
  result.data.allTag.nodes.forEach(({ name }) => {
    createPage({
      path: `/Tags/${name}`,
      component: path.resolve('./src/templates/Tag.jsx'),
      context: {
        slug: name,
      },
    });
  });
};
