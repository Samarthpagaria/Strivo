import React from "react";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverFooter,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function UserProfile({ user, onLogout }) {
  if (!user) return null;

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || "https://avatar.vercel.sh/128"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-background/95 dark:bg-black/95 backdrop-blur-xl border border-border dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <PopoverHeader className="bg-muted/30 dark:bg-white/5 border-b border-border dark:border-white/5 p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-background dark:border-black shadow-md">
              <AvatarImage
                src={user.avatar || "https://avatar.vercel.sh/128"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-black font-satoshi">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0">
              <PopoverTitle className="text-sm font-black font-satoshi uppercase tracking-tight text-foreground truncate w-full">
                {user.fullName}
              </PopoverTitle>
              <PopoverDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 font-satoshi truncate w-full">
                {user.email}
              </PopoverDescription>
            </div>
          </div>
        </PopoverHeader>
        <PopoverBody className="p-2 space-y-1">
          <Link to="/channel" className="block outline-none">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer font-black font-satoshi uppercase text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-xl px-3 h-10"
              size="sm"
            >
              <User className="mr-3 h-3.5 w-3.5" />
              Infrastructure
            </Button>
          </Link>
          <Link to="/settings" className="block outline-none">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer font-black font-satoshi uppercase text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-xl px-3 h-10"
              size="sm"
            >
              <Settings className="mr-3 h-3.5 w-3.5" />
              Parameters
            </Button>
          </Link>
        </PopoverBody>
        <PopoverFooter className="p-2 pt-0 bg-muted/10 dark:bg-transparent border-t border-border/50 dark:border-white/5 mt-1">
          <Button
            variant="ghost"
            className="w-full justify-start cursor-pointer font-black font-satoshi uppercase text-[10px] tracking-widest text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-xl px-3 h-10"
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-3.5 w-3.5" />
            Terminate
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
