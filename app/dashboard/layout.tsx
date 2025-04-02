'use client'
import { useContext, useState, type ReactNode } from "react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AuthContext } from "@/hooks/use-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/ui/loading";
import { CreateOrganizationModal } from "@/components/create-organization";
import Modal from "@/components/ui/modal";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ThemeContext is not provided. Wrap your component inside <ThemeProvider>.");
  }
  const { isAuthenticated, userData, groupData, organizationData } = authContext;

  if (!userData) {
    return <Loading />
  }
  if (!userData.organizationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          No Organization Found
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-md mb-6">
          It seems you are not part of any organization yet. Please ask your admin to add you,
          or create a new organization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="outline" onClick={() => setContactModalOpen(true)}>
            Contact Admin
          </Button>
          <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
            Create Organization
          </Button>
          <CreateOrganizationModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
          <Modal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)}>
            <div>
              If you are already part of an organization, try creating an organization using your organization email. If an error occurs during the process, it will display your admin's information.
            </div>
          </Modal>
        </div>
        <br></br>
        <Link href='/'>
          <Button size="lg" variant='outline'>
            Homepage
          </Button>
        </Link>
      </div>
    );
  }
  if (!organizationData) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Your page is almost ready...
      </h2>
    </div>
  }

  // if (!isAuthenticated) {
  //   return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
  //     <h1 className="text-4xl font-bold mb-4 text-red-600">Not Authenticated</h1>
  //     <p className="text-lg mb-8">You need to be logged in to access MergeFlow.</p>
  //     <div className="flex gap-4">
  //       <Link href="/login">
  //         <Button>Login</Button>
  //       </Link>
  //       <Link href="/signup">
  //         <Button variant="outline">Sign Up</Button>
  //       </Link>
  //     </div>
  //   </div>
  // }
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

