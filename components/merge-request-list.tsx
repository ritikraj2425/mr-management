import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "./ui/loading"

interface MergeRequest {
  _id: string
  title: string
  creator: any
  groupId: any
  status: string
  createdAt: string
  link: string
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

  if(!mergeRequests){
    return <Loading/>
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
              <TableRow key={mr?._id}>
                <TableCell className="font-medium">{mr.title}</TableCell>
                <TableCell>{mr.creator?.name}</TableCell>
                <TableCell>{mr?.groupId?.name}</TableCell>
                <TableCell>
                  <Badge variant={mr.status === "pending" ? "outline" : "default"}>
                    {mr?.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(mr?.createdAt)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={mr?.link}  target="_blank" rel="noopener noreferrer" >
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

