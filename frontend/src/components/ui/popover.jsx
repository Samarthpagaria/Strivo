"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

function Popover({ ...props }) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border shadow-md outline-hidden bg-white",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 rounded-t-md border-b px-3 py-2",
        className
      )}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }) {
  return (
    <p className={cn("text-foreground font-medium", className)} {...props} />
  );
}

function PopoverDescription({ className, ...props }) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}

function PopoverFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "mt-auto grid w-full gap-2 rounded-b-md border-t px-3 py-2",
        className
      )}
      {...props}
    />
  );
}

function PopoverBody({ children, className, ...props }) {
  return (
    <div className={cn("p-3", className)} {...props}>
      {children}
    </div>
  );
}

function PopoverAnchor({ ...props }) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

function PopoverClose({ ...props }) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverFooter,
  PopoverAnchor,
  PopoverClose,
};
