"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArtistForm } from "@/components/artist-form"

export default function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddArtist = () => {
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
        <ArtistForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </div>
    )
  }
  return (
    <div className="container mx-auto py-6">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Artists</CardTitle>
            <CardDescription>Manage your roster of artists</CardDescription>
          </div>
          <Button onClick={handleAddArtist}>
            <Plus className="mr-2 h-4 w-4" /> Add Artist
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="hiphop">Hip Hop</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Artist Card 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/diverse-musician-ensemble.png" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">John Doe</h3>
                      <Badge>Rock</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artist Card 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                  <AvatarImage src="/diverse-artists-studio.png" alt="Jane Smith" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Jane Smith</h3>
                      <Badge>Pop</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">jane.smith@example.com</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 987-6543</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artist Card 3 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/dj-at-turntables.png" alt="Mike Johnson" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Mike Johnson</h3>
                      <Badge>Electronic</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">mike.johnson@example.com</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 456-7890</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
