"use client"

import { useState } from "react"
import { FileText, Search, Filter, Download, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContractForm } from "@/components/contract-form"

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddContract = () => {
    setShowAddForm(true)
  }

  const handleFormSuccess = () => {
    setShowAddForm(false)
  }

  const handleFormCancel = () => {
    setShowAddForm(false)
  }

  if (showAddForm) {
    return (
      <div className="container mx-auto py-6">
        <ContractForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </div>
    )
  }
  return (
    <div className="container mx-auto py-6">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>Manage and view all artist contracts</CardDescription>
          </div>
          <Button onClick={handleAddContract}>
            <FileText className="mr-2 h-4 w-4" /> Generate New Contract
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Artists</SelectItem>
                <SelectItem value="artist1">John Doe</SelectItem>
                <SelectItem value="artist2">Jane Smith</SelectItem>
                <SelectItem value="artist3">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost">
              <Filter className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Promoter</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">CON-001</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Live Nation</TableCell>
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Signed</Badge>
                  </TableCell>
                  <TableCell>Apr 2, 2023</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" /> Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CON-002</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>AEG Presents</TableCell>
                  <TableCell>Jun 22, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
                  </TableCell>
                  <TableCell>May 10, 2023</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Send className="mr-1 h-3 w-3" /> Send
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" /> Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CON-003</TableCell>
                  <TableCell>Mike Johnson</TableCell>
                  <TableCell>Insomniac Events</TableCell>
                  <TableCell>Jul 8, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                  </TableCell>
                  <TableCell>Jun 15, 2023</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" /> Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
