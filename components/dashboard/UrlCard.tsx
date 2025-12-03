"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import {
  Copy,
  CornerDownRight,
  ExternalLink,
  MousePointerClickIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { linkType } from "@/lib/validation/link.schema";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { clearDate, timeAgo } from "@/lib/utils/date";
import { deleteCode } from "@/lib/api";
import { removeLink } from "@/hooks/useLinks";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL || "zaaaplink.vercel.app";

export const compactUrl = (url: string, isMobile: boolean) => {
  if (!url) return "";
  const clean = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const startLen = isMobile ? 10 : 20;
  const endLen = 10;
  // this would only return like github.com only short url should not be trimmed
  if (clean.length <= startLen + endLen + 3) {
    return clean;
  }

  const start = clean.slice(0, startLen); // forward slice
  const end = clean.slice(-endLen); // reverse
  return `${start}...${end}`;
};

const UrlCard = ({
  data,
  page = "urls",
}: {
  data: linkType;
  page?: "analytics" | "urls";
}) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <section className="border border-b-sidebar-border rounded-md px-3 pt-3">
      <div className="border border-b-sidebar-border rounded-md p-3 flex justify-between items-center">
        <div className="flex gap-2">
          {/* logo for ex : github.com logo for now we can add custom in furture */}
          <div className="max-sm:my-auto max-sm:mr-1 max-sm:border-0 sm:p-2 rounded-full border border-sidebar-border">
            <div className="max-sm:rounded-full">
              <Avatar>
                <AvatarImage
                  className="max-sm:p-1 max-sm:border max-sm:rounded-full"
                  src={data.icon || "https://github.com/karthiknandam.png"}
                  alt="@zap"
                />
                <AvatarFallback className="inline-flex items-center justify-center">
                  ZAP
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Url details */}
          <div className="flex flex-col justify-center gap-1">
            <div className="flex gap-2 items-center">
              <a
                className="font-semibold text-base cursor-pointer"
                // href={`/code/${data.code}?payload=${encodeURIComponent(
                //   JSON.stringify(data)
                // )}`}
                href={page === "urls" ? `/code/${data.code}` : undefined}
              >
                {isMobile ? MAIN_URL.slice(0, 5) + "..." : MAIN_URL}/{data.code}
              </a>
              <Copy
                size={15}
                className="cursor-pointer text-primary/50 hover:text-primary"
                onClick={async () => {
                  /**
                   * Copy to clip board from the url
                   */
                  await navigator.clipboard.writeText(
                    `${MAIN_URL}/${data.code}`
                  );
                  toast.success("Copied to Clipboard");
                }}
              />
              <ExternalLink
                size={16}
                className="cursor-pointer text-primary/50 hover:text-primary"
                onClick={() => {
                  router.push(data.url);
                }}
              />
            </div>
            <div className="flex">
              <CornerDownRight size={20} className="text-primary/30" />
              <p className="ml-2 text-primary/40 font-medium cursor-pointer">
                {compactUrl(data.url, isMobile)}
              </p>
            </div>
          </div>
        </div>

        {/* Edit and Delete */}
        <MoreButton code={data.code} queryClient={queryClient} page={page} />
      </div>

      {/* Counter + Date */}

      <div className="flex justify-between my-3 items-center">
        <div className="flex gap-2">
          <div className="bg-background border border-sidebar-border p-1 flex gap-1 rounded-sm">
            <MousePointerClickIcon
              size={isMobile ? 16 : 18}
              className="text-primary/80"
            />
            <span className="max-sm:text-xs sm:text-sm text-primary/90">
              {data.count} Clicks
            </span>
          </div>
          <div className="bg-background border border-sidebar-border p-1 flex gap-1 rounded-sm">
            <span className="max-sm:text-xs sm:text-sm text-primary/90">
              {data.lastClicked == undefined
                ? "No visits"
                : timeAgo(data.lastClicked)}
            </span>
          </div>
        </div>
        {data.createdAt && (
          <p className="max-sm:text-xs sm:text-sm text-primary/40">
            {clearDate(data.createdAt)}
          </p>
        )}
      </div>
    </section>
  );
};

export function MoreButton({
  code,
  queryClient,
  page = "urls",
}: {
  code: string | undefined;
  queryClient: QueryClient;
  page?: "analytics" | "urls";
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  if (code == undefined) {
    toast.error("Code not found");
    return;
  }

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            aria-label="Open menu"
            size="icon-sm"
            className="cursor-pointer"
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-20" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure</DialogTitle>
            <DialogDescription>
              Once you delete the link you cannot fetch analylitics
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={async () => {
                setIsDeleting(true);
                const data = await deleteCode(code);
                if (data.data.success) {
                  removeLink(code, queryClient);
                  toast.success("Deleted Link");
                  setShowNewDialog(false);
                  setIsDeleting(false);
                  if (page === "analytics") {
                    router.back();
                    // if there is not back navigation we can push it;
                    setTimeout(() => {
                      router.push("/");
                    }, 300);
                  }
                  return;
                }
                setIsDeleting(false);
                console.log(data.data.error);
              }}
            >
              <span>{isDeleting ? <Spinner /> : "Delete"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Edit{" "}
              <span className="ml-2">
                <Badge variant={"secondary"}>OnProgress</Badge>{" "}
              </span>
            </DialogTitle>
            <DialogDescription>
              Edit your url Analytics should stays after edit
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={true}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UrlCard;
