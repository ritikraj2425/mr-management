import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "./ui/label"

interface userGroups {
    _id: string
    name: string
    members: any
}


export function UserGroups({ userGroups} :any) {

    return (
        <div className="md:mt-4 mt-2">
        <Label>Your Groups</Label>
        <div className="rounded-md border ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Members</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userGroups?.map((group: any) => (
                        <TableRow key={group?._id}>
                            <TableCell>{group?.name}</TableCell>
                            <TableCell>{group?.members?.length} </TableCell>
                            <TableCell className="justify-center items-center flex">
                                <Button className="bg-red-600 text-white">
                                    Left group
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        </div>
    )
}

