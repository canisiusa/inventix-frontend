

import { BadgeCheck, BellDot, CreditCard, FileTerminalIcon } from 'lucide-react'
import SidebarNav from './_components/sidebar-nav'
import { ReactNode } from 'react'

export default function Settings({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-1 flex-col space-y-2 overflow-hidden p-8 justify-center md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
      <aside className='top-0 lg:sticky lg:w-1/5'>
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <div className='flex w-full overflow-y-hidden p-1 pr-4'>
        {children}
      </div>
    </div>
  )
}

const sidebarNavItems = [
  {
    title: 'Account',
    icon: <BadgeCheck size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Notifications',
    icon: <BellDot size={18} />,
    href: '/settings/notifications',
  },
  {
    title: 'Billing',
    icon: <CreditCard size={18} />,
    href: '/settings/billing',
  },
  {
    title: 'Display',
    icon: <FileTerminalIcon size={18} />,
    href: '/settings/display',
  },
]
