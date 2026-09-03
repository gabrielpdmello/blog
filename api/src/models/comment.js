const { prisma } = require("../lib/prisma.js");

async function getAllComments() {
  return prisma.comment.findMany({
    include: {
      author: true,
    },
  });
}

async function getAllCommentsPublished() {
  return prisma.$queryRaw`
select c.* from comment c
join blog_post p on (p.id = c.post_id)
where p.is_published = true;
  `;
}

async function getCommentsByPostId(id) {
  return prisma.comment.findMany({
    where: {
      post_id: id,
    },
    include: {
      author: {
        select: { name: true, username: true, is_blog_author: true },
      },
    },
  });
}

async function addComment(postId, userId, comment) {
  return prisma.comment.create({
    data: {
      post_id: postId,
      user_id: userId,
      content: comment,
    },
  });
}

async function deleteComment(postId) {
  return prisma.comment.delete({
    where: {
      id: postId,
    },
  });
}

async function getCommentById(id) {
  return prisma.comment.findUnique({
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

module.exports = {
  getAllComments,
  getAllCommentsPublished,
  getCommentsByPostId,
  addComment,
  deleteComment,
  getCommentById,
};
