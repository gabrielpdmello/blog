const { prisma } = require("../lib/prisma.js");

async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      is_blog_author: true,
    },
  });
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      is_blog_author: true,
    },
  });
}

async function getUserByUsername(username) {
  return prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      id: true,
      name: true,
      username: true,
      is_blog_author: true,
    },
  });
}

async function getFullUserByUsername(username) {
  return prisma.user.findFirst({
    where: {
      username: username,
    },
  });
}

async function createUser(name, username, password) {
  return prisma.user.create({
    data: {
      name: name,
      username: username,
      password: password,
      is_blog_author: false,
    },
  });
}

async function getAllUsersFromPostId(postId) {
  return prisma.$queryRaw`
select distinct u.id, u.name, u.username from "user" u 
join "comment" c on (u.id = c.user_id)
where c.post_id = ${postId};
  `;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getFullUserByUsername,
  createUser,
  getAllUsersFromPostId,
};
