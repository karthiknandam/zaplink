//  This page is dynamic routing -> We can ensure that it can redirect to either destination url or Main landing page.tsx

import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: { code: string };
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;
  const userAgent = (await headers()).get("user-agent") || "India";

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
    prisma.linkStats.create({
      data: {
        code,
        vistTime: new Date(),
        userAgent: userAgent,
      },
    }),
  ]);

  redirect(link.url);
}
