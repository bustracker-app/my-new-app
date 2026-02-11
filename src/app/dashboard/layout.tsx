import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Banknote,
  Bus,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import Header from '@/components/header';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '#', icon: Users, label: 'Students & Staff' },
  { href: '#', icon: BookOpen, label: 'Homework' },
  { href: '#', icon: GraduationCap, label: 'Academics' },
  { href: '#', icon: Banknote, label: 'Fees & Transport' },
  { href: '/dashboard/bus-tracking', icon: Bus, label: 'Bus Tracking' },
  { href: '#', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-2">
              <GraduationCap className="text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold font-headline text-sidebar-foreground">
                Abu Huraira Institute
              </h2>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile">
                    <Link href="#">
                        <User />
                        <span>Profile</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                    <Link href="/">
                        <LogOut />
                        <span>Logout</span>
                    </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
