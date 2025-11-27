"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleQuestionMark } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { createCode } from "@/lib/api";

import { useQueryClient } from "@tanstack/react-query";
import { revalidateLogic, useForm } from "@tanstack/react-form";

import { addNewLink } from "@/hooks/useLinks";
import { twMerge } from "tailwind-merge";
import { Suspense, useState } from "react";
import { Spinner } from "../ui/spinner";

/**
 * On Progress Enum
 */

export enum Expiry {
  NEVER,
}

export function Create({
  className,
  type = "primary",
}: {
  className?: string;
  type?: "primary" | "secondary";
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      url: "",
      code: "",
      exipiry: Expiry,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => {
        if (!value.url) {
          return { url: "url should not be empty" };
        }
        return undefined;
      },
      onChange: ({ value }) => {
        if (!value.url) {
          return { url: "url should not be empty" };
        }
        return undefined;
      },
    },
    onSubmit: async () => {
      try {
        setIsSubmitting(true);
        const data = form.state.values;
        const response = await createCode(data);
        const { success, message, data: resData, error } = response;

        if (!success) {
          const errors: string[] = error.map((m: any) => m.message);
          if (errors.length) {
            errors.forEach((e) => {
              toast.error(e);
            });
          } else {
            toast.error(message);
          }
          setIsSubmitting(false);
          return;
        }

        // Get the link and insert into the state as well;
        if (resData == undefined) {
          toast.error(JSON.stringify(error));
          setIsSubmitting(false);
          return;
        }
        addNewLink(resData, queryClient);
        setOpen(false);
        form.reset({ url: " ", code: " ", exipiry: Expiry });
        toast.success("Created ✅");
        setIsSubmitting(false);
      } catch (error) {
        toast.error(JSON.stringify(error));
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className={twMerge(
              `bg-background! text-md flex justify-between hover:shadow-secondary-foreground/80 cursor-pointer`,
              className
            )}
          >
            <p>Create</p>
            {type === "primary" && (
              <span
                className={twMerge(
                  `text-sm size-6 text-primary/50 hover:text-primary/50 border border-sidebar-border rounded-sm flex justify-center items-center`,
                  className
                )}
              >
                C
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[473px] md:max-w-[700px] lg:max-w-[1200px] bg-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl mb-3">Create New Link</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Url Form Data */}

            <form.Field
              name="url"
              validators={{
                onDynamic: ({ value }) =>
                  !value.trim() ? "please provider url" : "",
              }}
              children={(field) => (
                <div className="grid gap-3">
                  <Label className="text-md">
                    <div>Destination URL</div>
                    <HoverCardDemo />
                  </Label>
                  <Input
                    placeholder="https://github.com/karthiknandam"
                    className="text-base"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                  />

                  <p className="text-sm pl-3 text-red-800">
                    {field.state.meta.errorMap.onDynamic}
                  </p>
                </div>
              )}
            />

            {/* Code Form Data */}

            <form.Field
              name="code"
              validators={{
                onDynamic: ({ value }) => {
                  const trimmed = value.trim();
                  if (trimmed.length > 7)
                    return "Code must not exceed 7 characters";

                  return ""; // valid
                },
              }}
              children={(field) => (
                <div className="grid gap-3">
                  <Label htmlFor="name-1" className="text-md">
                    <div>Custom Code</div>
                  </Label>
                  <Input
                    maxLength={7}
                    min={6}
                    placeholder="optional"
                    className="text-base"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                  />
                  <p className="text-sm pl-3 text-red-800">
                    {field.state.meta.errorMap.onDynamic}
                  </p>
                </div>
              )}
            />

            {/* Expiry Form Data */}
            <form.Field
              name="exipiry"
              children={(field) => (
                <div className="grid gap-3">
                  <Label htmlFor="expiry" className="text-md font-medium">
                    Exipiration{" "}
                    {
                      <Badge
                        className="h-5 min-w-5 rounded-full px-1 tabular-nums"
                        variant="outline"
                      >
                        OnProgress
                      </Badge>
                    }
                  </Label>
                  <Input
                    id="expiry"
                    disabled={true}
                    className="text-base"
                    name="username"
                    defaultValue="@never"
                  />
                </div>
              )}
            />
          </div>

          {/* Footer + Submit / Cancel */}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  form.reset();
                }}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={async () => {
                const formData = form.state;
                await form.handleSubmit(formData);
              }}
              className="cursor-pointer"
            >
              <span>{isSubmitting ? <Spinner /> : "Create"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

/**
 ** For hover card ? we can use this
 */

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className="p-0! size-4! cursor-pointer text-primary/50 hover:text-primary/90"
        >
          <CircleQuestionMark />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-60">
        <div className="flex justify-between gap-4">
          <h4 className="text-sm">
            The URL your users will get redirected to when they visit your short
            link.
          </h4>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
