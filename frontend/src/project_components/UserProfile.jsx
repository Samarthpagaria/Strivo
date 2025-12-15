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
      <PopoverContent className="w-62">
        <PopoverHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.avatar || "https://avatar.vercel.sh/128"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <PopoverTitle className="text-sm font-semibold">
                {user.fullName}
              </PopoverTitle>
              <PopoverDescription className="text-xs text-muted-foreground">
                {user.email}
              </PopoverDescription>
            </div>
          </div>
        </PopoverHeader>
        <PopoverBody className="space-y-1 px-2 py-1">
          <Link to="/channel">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              size="sm"
            >
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            size="sm"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </PopoverBody>
        <PopoverFooter>
          <Button
            variant="outline"
            className="w-full bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border-red-200 cursor-pointer"
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
