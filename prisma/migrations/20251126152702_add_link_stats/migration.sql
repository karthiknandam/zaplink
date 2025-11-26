-- CreateTable
CREATE TABLE "LinkStats" (
    "id" TEXT NOT NULL,
    "vistTime" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,

    CONSTRAINT "LinkStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkStats" ADD CONSTRAINT "LinkStats_code_fkey" FOREIGN KEY ("code") REFERENCES "Link"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
