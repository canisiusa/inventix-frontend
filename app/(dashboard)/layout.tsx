import { AppSidebar } from "@/components/app-sidebar"
import { NavUser } from "@/components/app-sidebar/nav-user"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AlertTriangle, Bell, Search, Settings } from "lucide-react"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Prompt />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-sidebar">
          <header className="flex justify-between bg-sidebar h-11 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 cursor-pointer text-sm px-4 h-8 w-96 text-white font-light rounded-lg bg-[#425b76]">
              <div className="flex items-center">
                <Search className="h-3" />
                Rechercher sur Inventix
              </div>
            </div>
            <div className="flex items-center gap-5 pr-2">
              <div className="flex items-center gap-3">
                <Settings color="white" strokeWidth={1} />
                <Bell color="white" strokeWidth={1} />
              </div>
              <div className="h-6 w-px bg-[#516f90]"></div>
              <NavUser user={{
                name: "shadcn",
                email: "m@example.com",
                avatar: "/avatars/shadcn.jpg",
              }} />
            </div>
          </header>
          <div className="flex-1 p-4 pt-0 bg-[#f6f8fa] rounded-tl-md">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

const Prompt = () => {
  return (
    <div className=" fixed inset-0 z-[4000000000] w-full h-full bg-[#141313d9] place-content-center md:hidden grid">
      <div className="max-w-md flex flex-col justify-center items-center">
        <div className="flex gap-3 items-center mb-2">
          <AlertTriangle className="text-3xl text-orange-600" strokeWidth={1}/>
          <h3 className="text-2xl font-bold text-white">
            Accès limité
          </h3>
        </div>
        <p className="text-stone-200">
          Ce site est optimisé pour les écrans de tablette et d&apos;ordinateur.
          Veuillez utiliser un appareil avec une largeur minimale de 768px.
        </p>
      </div>
    </div>
  );
};
