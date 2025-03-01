"use client"

import {
  BadgeCheck,
  BellDot,
  ChevronDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function NavUser() {

  const { data: session } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-1 py-1.5 text-sm cursor-pointer text-white hover:bg-[#425b76] rounded-lg">
          <Avatar className="h-5 w-5 rounded-full">
            <AvatarImage src={"/avatar.png"} alt={session?.user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <span className="truncate font-semibold text-sm">{session?.user.name}</span>
          <ChevronDown className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={'/avatar/png'} alt={session?.user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{session?.user.name}</span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push('/settings/account')
            }}
          >
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push('/settings/notifications')
            }}
          >
            <BellDot />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
