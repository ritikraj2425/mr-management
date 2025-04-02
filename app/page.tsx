'use client'
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, GitMerge, Users } from "lucide-react"
import logout from "@/utils/logout"
import { Button } from "@/components/ui/button"
import { useContext, useState } from "react"
import { AuthContext } from "@/hooks/use-context"
import { CreateOrganizationModal } from "@/components/create-organization"

export default function Home() {
  const themeContext = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!themeContext) {
    throw new Error("ThemeContext is not provided. Wrap your component inside <ThemeProvider>.");
  }
  const { isAuthenticated } = themeContext;
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="p-1 flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GitMerge className="h-6 w-6 text-primary" />
            <span className="text-xl">MergeFlow</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            {
              !isAuthenticated ?
                <>
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Login
                  </Link>
                  <Link href="/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Signup
                  </Link>
                  <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </>
                :
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Link>
                  <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                  <div onClick={logout} className="text-sm cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                    Logout
                  </div>
                </>
            }

          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-background py-12 md:py-16 lg:py-20 " >
          <div className="p-1 grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-32">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Empower Your Organization with Seamless MR Management
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Streamline your code review process, enhance team collaboration, and boost productivity with our
                intuitive merge request platform.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {
                  !isAuthenticated ?
                    <>
                      <Button asChild size="lg">
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                      <Button variant="outline" size="lg">
                        <Link href="/about">Learn More</Link>
                      </Button>
                    </>
                    :
                    <>
                      <Button asChild size="lg">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <Button onClick={() => setIsModalOpen(true)} variant="outline" size="lg">
                        Create Organization
                      </Button>
                      <CreateOrganizationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                      />
                    </>
                }
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=500"
                width={500}
                height={400}
                alt="MR Management Platform"
                className="rounded-xl object-cover shadow-md"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/40 py-12 md:py-16 lg:py-20">
          <div className="p-1 px-4 md:px-6">
            <div className="mx-auto mb-10 max-w-[58rem] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Everything you need to manage your merge requests efficiently
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Organization Management</h3>
                <p className="text-center text-muted-foreground">
                  Create and manage organizations with ease. Add team members and assign roles.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <GitMerge className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">MR Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Track the status of merge requests from creation to completion.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <CheckCircle className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Team Collaboration</h3>
                <p className="text-center text-muted-foreground">
                  Collaborate with team members through comments and notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-background py-12 md:py-16 lg:py-20">
          <div className="p-1 px-4 md:px-6">
            <div className="mx-auto mb-10 max-w-[58rem] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Get started in just three simple steps</p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Create or Join a Group</h3>
                <p className="text-center text-muted-foreground">
                  Start by creating your organization or joining an existing one.
                </p>
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-muted-foreground md:block" />
              </div>
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Raise a Merge Request</h3>
                <p className="text-center text-muted-foreground">
                  Create a merge request with all the necessary details.
                </p>
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-muted-foreground md:block" />
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Review & Merge</h3>
                <p className="text-center text-muted-foreground">
                  Review the merge request, provide feedback, and merge when ready.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="p-1 flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <GitMerge className="h-5 w-5 text-primary" />
              <span>MergeFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MergeFlow. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

