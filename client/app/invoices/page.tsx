"use client"

import { useState } from "react"
import { CreditCard, Search, Filter, Plus, RefreshCw, Mail, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoiceForm } from "@/components/invoice-form"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddInvoice = () => {
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
        <InvoiceForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage and track all invoices</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleAddInvoice}>
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Promoter</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV-001</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Live Nation</TableCell>
                  <TableCell>$5,000.00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                  <TableCell>Apr 15, 2023</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <CreditCard className="mr-1 h-3 w-3" /> View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-002</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>AEG Presents</TableCell>
                  <TableCell>$7,500.00</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                  </TableCell>
                  <TableCell>May 22, 2023</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="mr-1 h-3 w-3" /> Resend
                      </Button>
                      <Button variant="outline" size="sm">
                        <Check className="mr-1 h-3 w-3" /> Mark Paid
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-003</TableCell>
                  <TableCell>Mike Johnson</TableCell>
                  <TableCell>Insomniac Events</TableCell>
                  <TableCell>$3,200.00</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                  </TableCell>
                  <TableCell>Jun 8, 2023</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="mr-1 h-3 w-3" /> Resend
                      </Button>
                      <Button variant="outline" size="sm">
                        <Check className="mr-1 h-3 w-3" /> Mark Paid
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
