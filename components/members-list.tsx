import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Member {
  _id: string
  name: string
  email: string
  isAdmin: string
}

interface MembersListProps {
  members: Member[]
}

export function MembersList({ members, isAdmin }: { members: Member[]; isAdmin: boolean }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {
              isAdmin ?
                <TableHead className="w-[80px]">Actions</TableHead>
                : <></>
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member?._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src='/placeholder.svg?height=40&width=40' alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
              </TableCell>
              <TableCell>{member?.email}</TableCell>
              <TableCell>{member?.isAdmin ? "Admin" : "Member"}</TableCell>
              {isAdmin ?
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>Remove from Group</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                :
                <></>
              }

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

