-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
