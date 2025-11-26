"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import {
  Copy,
  CornerDownRight,
  ExternalLink,
  MoreHorizontal,
  MousePointerClickIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { clearDate, timeAgo } from "@/lib/utils/date";
import { deleteCode } from "@/lib/api";
import { removeLink } from "@/hooks/useLinks";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const MAIN_URL = process.env.MAIN_URL || "localhost:3000";

const UrlCard = ({ data }: { data: linkType }) => {
  const queryClient = useQueryClient();
  return (
    <section className="border border-b-sidebar-border rounded-md px-3 pt-3">
      <div className="border border-b-sidebar-border rounded-md p-3 flex justify-between items-center">
        <div className="flex gap-2">
          {/* logo for ex : github.com logo for now we can add custom in furture */}
          <div className="p-3 rounded-full border border-sidebar-border inline-block">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar>
                <AvatarImage
                  src="https://github.com/karthiknandam.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Url details */}
          <div className="flex flex-col justify-center gap-1">
            <div className="flex gap-2 items-center">
              <a
                className="font-semibold text-base cursor-pointer"
                href={`/code/${data.code}`}
              >
                {MAIN_URL}/{data.code}
              </a>
              <Copy
                size={17}
                className="cursor-pointer text-primary/50 hover:text-primary"
                onClick={async () => {
                  /**
                   * Copie to clip board from the url
                   */

                  await navigator.clipboard.writeText(
                    `${MAIN_URL}/${data.code}`
                  );
                  toast.success("Copied to Clipboard");
                }}
              />
              <ExternalLink
                size={18}
                className="cursor-pointer text-primary/50 hover:text-primary"
                onClick={() => {
                  /**
                   * Redirect to the plac of the url
                   */
                  redirect(data.url);
                }}
              />
            </div>
            <div className="flex">
              <CornerDownRight size={20} className="text-primary/30" />
              <p className="ml-2 text-primary/40 font-medium cursor-pointer">
                {data.url}
              </p>
            </div>
          </div>
        </div>

        {/* Edit and Delete */}
        <DropdownMenuDialog code={data.code} queryClient={queryClient} />
      </div>

      {/* Counter + Date */}

      <div className="flex justify-between my-3 items-center">
        <div className="flex gap-2">
          <div className="bg-background border border-sidebar-border p-1 flex gap-1 rounded-sm">
            <MousePointerClickIcon size={18} className="text-primary/80" />
            <span className="text-sm text-primary/90">{data.count} Clicks</span>
          </div>
          <div className="bg-background border border-sidebar-border p-1 flex gap-1 rounded-sm">
            <span className="text-sm text-primary/90">
              {data.lastClicked == undefined
                ? "No visits"
                : "Last visited " + timeAgo(data.lastClicked)}
            </span>
          </div>
        </div>
        {data.createdAt && (
          <p className="text-sm text-primary/40">{clearDate(data.createdAt)}</p>
        )}
      </div>
    </section>
  );
};

export function DropdownMenuDialog({
  code,
  queryClient,
}: {
  code: string | undefined;
  queryClient: QueryClient;
}) {
  if (code == undefined) {
    toast.error("Code not found");
    return;
  }

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu" size="icon-sm">
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
                const data = await deleteCode(code);
                if (data.success) {
                  removeLink(code, queryClient);
                  toast.success("Deleted file");
                  setShowNewDialog(false);
                  return;
                }
              }}
            >
              Delete
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
