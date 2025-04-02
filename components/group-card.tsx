import Link from "next/link"
import { GitMerge, Users } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface GroupCardProps {
  group: {
    _id: string
    name: string
    description: string
    pendingMRs: number
    totalMRs: number
    members: any
    MRs: any
  }
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{group.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{group?.MRs?.length} MRs</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{group?.members?.length} members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/dashboard/groups/${group._id}`}>View Group</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

