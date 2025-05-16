"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { CalendarIcon, Filter, Plus, RefreshCw, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchBookings,
  setFilters,
  clearFilters,
  setSelectedBooking,
  type BookingStatus,
} from "@/lib/features/bookings/bookingsSlice"
import { fetchArtists } from "@/lib/features/artists/artistsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function BookingDashboard({ onNewBooking }: { onNewBooking: () => void }) {
  const dispatch = useAppDispatch()
  const { filteredItems, status, filters } = useAppSelector((state) => state.bookings)
  const { items: artists, status: artistsStatus } = useAppSelector((state) => state.artists)
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchArtists())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchBookings())
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      dispatch(setFilters({ startDate: date.toISOString() }))
    }
  }

  const handleArtistFilter = (artistId: string) => {
    dispatch(setFilters({ artistId }))
  }

  const handleStatusFilter = (status: BookingStatus) => {
    dispatch(setFilters({ status }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setDate(undefined)
    setSearchTerm("")
  }

  const handleSelectBooking = (booking: any) => {
    dispatch(setSelectedBooking(booking))
  }

  const filteredBookings =
    searchTerm && Array.isArray(filteredItems)
      ? filteredItems.filter(
          (booking) =>
            booking.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.promoterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.venueName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : filteredItems

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "proposed":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Proposed
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Bookings</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={onNewBooking}>
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-8" value={searchTerm} onChange={handleSearch} />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
          <Select onValueChange={handleArtistFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by artist" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(artists) && artists.length > 0 ? (
                artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading artists...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proposed">Proposed</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={handleClearFilters}>
            <Filter className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
        {status === "loading" ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artist</TableHead>
                  <TableHead>Promoter</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectBooking(booking)}
                    >
                      <TableCell>{booking.artistName}</TableCell>
                      <TableCell>{booking.promoterName}</TableCell>
                      <TableCell>{booking.venueName}</TableCell>
                      <TableCell>{format(new Date(booking.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>${booking.fee.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {booking.hasContract && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              Contract
                            </Badge>
                          )}
                          {booking.hasInvoice && (
                            <Badge variant="secondary" className="bg-green-50 text-green-700">
                              Invoice
                            </Badge>
                          )}
                          {booking.hasItinerary && (
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                              Itinerary
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
