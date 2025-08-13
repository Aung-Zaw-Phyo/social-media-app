-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "content" SET DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_id_key" ON "public"."Like"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "public"."Like"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
