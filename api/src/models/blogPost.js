const { prisma } = require("../lib/prisma.js");

async function getAllPosts() {
  return prisma.blog_post.findMany();
}

async function getAllPublishedPosts() {
  return prisma.blog_post.findMany({
    where: {
      is_published: true,
    },
  });
}

async function getAllUnpublishedPosts() {
  return prisma.blog_post.findMany({
    where: {
      is_published: false,
    },
  });
}

async function getPostById(id) {
  return prisma.blog_post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        select: { name: true, username: true, is_blog_author: true },
      },
    },
  });
}

async function setPublishStatus(postId, isPublished) {
  const published_at = isPublished ? new Date() : null;
  return prisma.blog_post.update({
    where: {
      id: postId,
    },
    data: {
      is_published: isPublished,
      published_at: published_at,
    },
  });
}

async function deletePost(postId) {
  return prisma.blog_post.delete({
    where: {
      id: postId,
    },
  });
}

async function createPost(authorId, title, intro, content, isPublished) {
  const published_at = isPublished ? new Date() : null;
  return prisma.blog_post.create({
    data: {
      author_id: authorId,
      title: title,
      intro: intro,
      content: content,
      published_at: published_at,
      is_published: isPublished,
    },
  });
}

async function editPost(postId, title, intro, content, isPublished) {
  const published_at = isPublished ? new Date() : null;
  return prisma.blog_post.update({
    data: {
      title: title,
      intro: intro,
      content: content,
      published_at: published_at,
      is_published: isPublished,
    },
    where: {
      id: postId,
    },
  });
}

module.exports = {
  getAllPosts,
  getAllPublishedPosts,
  getAllUnpublishedPosts,
  setPublishStatus,
  getPostById,
  deletePost,
  createPost,
  editPost,
};
