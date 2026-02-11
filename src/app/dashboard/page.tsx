import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ClipboardList,
  Printer,
  FileText,
  BookCopy,
  Building,
  Scan,
  CalendarCheck,
  ClipboardCheck,
  Megaphone,
  MessageSquare,
  Users2,
  Calendar,
  Wallet,
  FileSignature,
} from 'lucide-react';
import Link from 'next/link';

const quickAccessItems = [
  { icon: Users, label: 'Students', href: '#' },
  { icon: FileSignature, label: 'View Admissions', href: '#' },
  { icon: ClipboardList, label: 'Marks Entry', href: '#' },
  { icon: Printer, label: 'Printing', href: '#' },
  { icon: FileText, label: 'Roll Statement', href: '#' },
  { icon: BookCopy, label: 'Subject Management', href: '#' },
  { icon: Building, label: 'MDM Management', href: '#' },
  { icon: Scan, label: 'Sections', href: '#' },
  { icon: CalendarCheck, label: 'Attendance', href: '#' },
  { icon: ClipboardCheck, label: 'Homework', href: '#' },
  { icon: Megaphone, label: 'Online Form', href: '#' },
  { icon: MessageSquare, label: 'Feedback Box', href: '#' },
  { icon: Users2, label: 'Staff Details', href: '#' },
  { icon: Calendar, label: 'TimeTable', href: '#' },
  { icon: Wallet, label: 'Extras', href: '#' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Quick Access Container */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Quick Access</CardTitle>
          <CardDescription>
            Shortcuts for Admin and Teacher roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {quickAccessItems.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 text-center p-2"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium leading-snug">{item.label}</span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
      
      {/* Permanent Structure */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Child Profiles & ID Cards</CardTitle>
            <CardDescription>View all students, print profiles, and generate ID cards.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto">View All Students</Button>
            <Button variant="secondary" className="w-full sm:w-auto">Generate ID Cards</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">ADMIN</CardTitle>
            <CardDescription>Staff Management, Role & Permission control, User Approval.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto">Manage Staff</Button>
            <Button variant="secondary" className="w-full sm:w-auto">User Approvals</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Homework Helper – Homework Guide</CardTitle>
            <CardDescription>Access resources and guides for completing homework assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full sm:w-auto">Open Homework Guide</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Private Schools – Manage Fees & Transport</CardTitle>
            <CardDescription>A private dashboard for managing fees and transportation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto">Manage Fees</Button>
            <Button variant="secondary" className="w-full sm:w-auto">Manage Transport</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
