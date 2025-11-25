//  This page is dynamic routing -> We can ensure that it can redirect to either destination url or Main landing page.tsx

import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: { code: string };
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) return notFound();

  await prisma.$transaction([
    prisma.link.update({
      where: { code },
      data: {
        count: { increment: 1 },
        lastClicked: new Date(),
      },
    }),
  ]);

  redirect(link.url);
}
