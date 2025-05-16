"use client"

import { useState } from "react"
import { MapPin, Search, Plus, Edit, Trash2, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VenueForm } from "@/components/venue-form"

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddVenue = () => {
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
        <VenueForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Venues</CardTitle>
            <CardDescription>Manage venue information</CardDescription>
          </div>
          <Button onClick={handleAddVenue}>
            <Plus className="mr-2 h-4 w-4" /> Add Venue
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
                <SelectItem value="losangeles">Los Angeles</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Past Events</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Madison Square Garden</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>New York, NY</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      20,000
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>John Smith</div>
                      <div className="text-xs text-muted-foreground">john.smith@msg.com</div>
                    </div>
                  </TableCell>
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
                  <TableCell className="font-medium">The Forum</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>Los Angeles, CA</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      17,500
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>Maria Garcia</div>
                      <div className="text-xs text-muted-foreground">maria.garcia@theforum.com</div>
                    </div>
                  </TableCell>
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
                <TableRow>
                  <TableCell className="font-medium">Red Rocks Amphitheatre</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>Morrison, CO</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      9,525
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>Robert Johnson</div>
                      <div className="text-xs text-muted-foreground">robert.johnson@redrocks.com</div>
                    </div>
                  </TableCell>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
