import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("1234", 10);
  const author = await prisma.user.create({
    data: {
      name: "Author",
      username: "author",
      password: password,
      is_blog_author: true,
    },
  });
  const reader = await prisma.user.create({
    data: {
      name: "Reader",
      username: "reader",
      password: password,
      is_blog_author: false,
    },
  });
  const blogPost1 = await prisma.blog_post.create({
    data: {
      author_id: 1,
      title: "This post is not published",
      intro: "This is post is not published",
      content: `
## This is a post
text text text

### sub title
more text text text
            `,
    },
  });
  const blogPost2 = await prisma.blog_post.create({
    data: {
      author_id: 1,
      title: "Welcome",
      intro: "This is post IS published",
      content: `
## This is a post
text text text

### sub title
more text text text
            `,
      published_at: new Date(),
      is_published: true,
    },
  });
  const comment1 = await prisma.comment.create({
    data: {
      post_id: 2,
      user_id: 1,
      content: "My post is incredible",
    },
  });
  const comment2 = await prisma.comment.create({
    data: {
      post_id: 2,
      user_id: 2,
      content: "Your post is incredible",
    },
  });
  const comment3 = await prisma.comment.create({
    data: {
      post_id: 2,
      user_id: 1,
      content: "Another comment",
    },
  });
  const comment4 = await prisma.comment.create({
    data: {
      post_id: 2,
      user_id: 2,
      content: "Another comment",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
