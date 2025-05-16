"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Building } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PromoterForm } from "@/components/promoter-form"

export default function PromotersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPromoter = () => {
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
        <PromoterForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Promoters</CardTitle>
            <CardDescription>Manage your promoter contacts</CardDescription>
          </div>
          <Button onClick={handleAddPromoter}>
            <Plus className="mr-2 h-4 w-4" /> Add Promoter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search promoters..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/diverse-group.png" alt="Alex Rodriguez" />
                        <AvatarFallback>AR</AvatarFallback>
                      </Avatar>
                      <div>Alex Rodriguez</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Live Nation</span>
                    </div>
                  </TableCell>
                  <TableCell>alex.rodriguez@livenation.com</TableCell>
                  <TableCell>+1 (555) 123-4567</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/diverse-woman-portrait.png" alt="Sarah Chen" />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div>Sarah Chen</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>AEG Presents</span>
                    </div>
                  </TableCell>
                  <TableCell>sarah.chen@aegpresents.com</TableCell>
                  <TableCell>+1 (555) 987-6543</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/thoughtful-man.png" alt="David Kim" />
                        <AvatarFallback>DK</AvatarFallback>
                      </Avatar>
                      <div>David Kim</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Insomniac Events</span>
                    </div>
                  </TableCell>
                  <TableCell>david.kim@insomniac.com</TableCell>
                  <TableCell>+1 (555) 456-7890</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
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
