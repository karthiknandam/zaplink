"use client";
import { useLinks } from "@/hooks/useLinks";
import { Create } from "./Create";
import { Skeleton } from "../ui/skeleton";

import {
  ArrowUpRightIcon,
  CreditCard,
  FolderOpenIcon,
  Table2Icon,
} from "lucide-react";

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
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { NavBar } from "./NavBar";
import { LinksTable } from "./UrlTable";
import { AnimatePresence, motion } from "motion/react";

const Main = () => {
  const { data, isPending } = useLinks();
  const [search, setSearch] = useState<string>("");
  const [table, setTable] = useState<boolean>(false);

  // prevent double restore in strict mode
  const restored = useRef(false);

  const filteredLinks = useMemo(() => {
    if (!data) return [];

    if (search.trim() === "") return data;

    return data.filter((item) =>
      item.url.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  useEffect(() => {
    if (!restored.current) {
      restored.current = true;

      const state = window.history.state;
      if (state?.table !== undefined) {
        setTable(state.table);
      }
    }
  }, []);

  useEffect(() => {
    window.history.replaceState({ ...window.history.state, table }, "");
  }, [table]);

  return (
    <section className="w-full h-full flex flex-col overflow-hidden mb-4">
      <NavBar />
      {(data?.length ?? 0) > 0 && (
        <div className="flex justify-between flex-1 px-4 mt-24">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="search by url"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-50"
            />
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => {
                setTable((p) => !p);
              }}
            >
              <span className="flex gap-2 items-center">
                {table ? (
                  <>
                    <CreditCard /> {" Cards View"}
                  </>
                ) : (
                  <>
                    <Table2Icon /> {" Table View"}
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      )}
      {!table ? (
        <div className="px-4 flex-1 mb-4">
          {isPending ? (
            <Skelitons />
          ) : data!.length === 0 ? (
            <EmptySection />
          ) : (
            <div className="flex flex-col gap-5 mt-4">
              <AnimatePresence>
                {filteredLinks?.map((link, i) => {
                  return (
                    <motion.div
                      key={link.id}
                      initial={{
                        y: 7,
                        opacity: 0,
                        filter: "blur(10px)",
                      }}
                      animate={{
                        opacity: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                      transition={{
                        ease: "easeInOut",
                        duration: 0.2 * i + 1,
                      }}
                    >
                      <UrlCard data={link} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 mt-2">
          <LinksTable data={filteredLinks} />
        </div>
      )}
    </section>
  );
};

const Skelitons = () => {
  return (
    <div className="flex flex-col gap-5 mt-24">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-[200px] rounded-md" />
        <Skeleton className="h-9 w-[125px] rounded-md" />
      </div>
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
    <Empty className="w-full h-full flex items-center justify-center mt-24">
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
