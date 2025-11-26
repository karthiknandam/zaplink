"use client";
import { useLinks } from "@/hooks/useLinks";
import { Create } from "./Create";
import { Skeleton } from "../ui/skeleton";

import { ArrowUpRightIcon, FolderOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import UrlCard from "./UrlCard";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { NavBar } from "./NavBar";

const Main = () => {
  const { data, isPending } = useLinks();
  const [search, setSearch] = useState("");

  const filteredLinks = useMemo(() => {
    if (!data) return [];

    if (search.trim() === "") return data;

    return data.filter((item) =>
      item.url.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const [table, setTable] = useState<boolean>(false);

  return (
    <section className="w-screen h-screen flex flex-col">
      <NavBar />
      <div className="flex justify-between px-4 mt-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-50"
          />
          <Button
            variant={"outline"}
            onClick={() => {
              setTable((p) => !p);
            }}
          >
            {table ? "Back" : "Table View"}
          </Button>
        </div>
      </div>
      {!table ? (
        <div className="px-4 my-4 flex-1">
          {isPending ? (
            <Skelitons />
          ) : data!.length === 0 ? (
            <EmptySection />
          ) : (
            <div className="flex flex-col gap-5">
              {filteredLinks?.map((link) => {
                return <UrlCard key={link.id} data={link} />;
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 mt-4 flex justify-center items-center flex-2">
          {/* {data && <LinksTable data={data || []} />} */}
          <div className="text-4xl font-bold">Under Construction</div>
        </div>
      )}
    </section>
  );
};

const Skelitons = () => {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-[105px] w-full rounded-xl" />
      <Skeleton className="h-[105px] w-full rounded-xl" />
      <Skeleton className="h-[105px] w-full rounded-xl" />
      <Skeleton className="h-[105px] w-full rounded-xl" />
      <Skeleton className="h-[105px] w-full rounded-xl" />
    </div>
  );
};

export function EmptySection() {
  return (
    <Empty className="w-full h-full flex items-center justify-center">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle>Create Short Url</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any url yet. Get started by creating your
          first short url.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Create
            className="bg-accent-foreground! text-secondary hover:bg-accent-foreground/80! hover:text-secondary"
            type={"secondary"}
          />
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
}

export default Main;
