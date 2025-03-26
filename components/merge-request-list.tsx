import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MergeRequest {
  id: string
  title: string
  creator: string
  group: string
  status: string
  createdAt: string
}

interface MergeRequestListProps {
  mergeRequests: MergeRequest[]
}

export function MergeRequestList({ mergeRequests }: MergeRequestListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergeRequests.length > 0 ? (
            mergeRequests.map((mr) => (
              <TableRow key={mr.id}>
                <TableCell className="font-medium">{mr.title}</TableCell>
                <TableCell>{mr.creator}</TableCell>
                <TableCell>{mr.group}</TableCell>
                <TableCell>
                  <Badge variant={mr.status === "pending" ? "outline" : "default"}>
                    {mr.status === "pending" ? "Pending" : "Merged"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(mr.createdAt)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/merge-requests/${mr.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No merge requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

