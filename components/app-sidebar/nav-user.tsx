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
import { logoutUser } from "@/lib/server-actions/auth"
import { handleError } from "@/lib/utils"
import { useLocalization } from "@/providers/localization-provider"
import { deleteAuthTokens } from "@/lib/authTokens"

export function NavUser() {

  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLocalization();


  const handleLogout = async () => {
    try {
      const resp = await logoutUser();
      if (resp.status === "success") {
        deleteAuthTokens()
        signOut({ callbackUrl: "/" });
      } else if (resp.status === "failure") {
        throw resp.data;
      }
    } catch (error) {
      console.error(error);
      handleError({ error, message: "Failed to log out", dict: t });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-1 py-1.5 text-sm cursor-pointer text-white hover:bg-[#425b76] rounded-lg">
          <Avatar className="h-5 w-5 rounded-full">
            <AvatarImage src={"/avatar.png"} alt={session?.companyUser.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <span className="truncate font-semibold text-sm">{session?.companyUser.name}</span>
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
              <AvatarImage src={'/avatar/png'} alt={session?.companyUser.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{session?.companyUser.name}</span>
              <span className="truncate text-xs">{session?.companyUser.user.email}</span>
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
          onClick={handleLogout}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
