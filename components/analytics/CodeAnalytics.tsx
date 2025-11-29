"use client";

import { AppLineChart } from "./Chart";
import UrlCard from "../dashboard/UrlCard";
import { BreadcrumbCollapsed } from "./BreadCrumb";
import { useUrl } from "@/hooks/useLinks";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";

const CodeAnalytics = ({ code }: { code: string }) => {
  // We can add better caching here

  const { data, isPending, isError } = useUrl(code);

  return (
    <div className="w-full mx-auto px-4 mt-24">
      {isPending ? (
        /**
         * Skelitons
         */
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[25px] w-[200px] rounded-sm" />
          <Skeleton className="h-[105px] w-full rounded-xl" />
          <Skeleton className="h-[200px] lg:h-[500px] w-full rounded-xl" />
        </div>
      ) : /**
       * 404 page
       */
      isError ? (
        <div className="w-full min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-3 text-center">
            <h1 className="text-3xl font-bold">404 Not Found</h1>
            <Link href="/">
              <Button variant="default" className="cursor-pointer">
                Go Back
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /**
         * Actual page
         */
        <>
          <BreadcrumbCollapsed code={code} />
          <div className="my-4">
            <UrlCard data={data.data.data} page="analytics" />
          </div>
          <div className="border border-sidebar-border pb-4 pr-8 pt-4 mb-4 rounded-2xl">
            <AppLineChart stats={data.stats} />
          </div>
        </>
      )}
    </div>
  );
};

export default CodeAnalytics;
