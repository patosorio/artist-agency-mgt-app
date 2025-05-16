"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createBooking } from "@/lib/features/bookings/bookingsSlice"
import { fetchArtists } from "@/lib/features/artists/artistsSlice"
import { fetchPromoters } from "@/lib/features/promoters/promotersSlice"
import { fetchVenues } from "@/lib/features/venues/venuesSlice"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  artistId: z.string({
    required_error: "Please select an artist.",
  }),
  promoterId: z.string({
    required_error: "Please select a promoter.",
  }),
  venueId: z.string({
    required_error: "Please select a venue.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  fee: z.coerce.number().min(1, {
    message: "Fee must be at least $1.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function BookingForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const { items: artists, status: artistsStatus } = useAppSelector((state) => state.artists)
  const { items: promoters, status: promotersStatus } = useAppSelector((state) => state.promoters)
  const { items: venues, status: venuesStatus } = useAppSelector((state) => state.venues)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee: 0,
    },
  })

  useEffect(() => {
    dispatch(fetchArtists())
    dispatch(fetchPromoters())
    dispatch(fetchVenues())
  }, [dispatch])

  const onSubmit = async (values: FormValues) => {
    try {
      const selectedArtist = artists.find((artist) => artist.id === values.artistId)
      const selectedPromoter = promoters.find((promoter) => promoter.id === values.promoterId)
      const selectedVenue = venues.find((venue) => venue.id === values.venueId)

      await dispatch(
        createBooking({
          ...values,
          date: values.date.toISOString(),
          artistName: selectedArtist?.name || "",
          promoterName: selectedPromoter?.name || "",
          venueName: selectedVenue?.name || "",
          status: "proposed",
        }),
      ).unwrap()

      toast({
        title: "Booking created",
        description: "Your booking has been created successfully.",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isLoading = artistsStatus === "loading" || promotersStatus === "loading" || venuesStatus === "loading"

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Booking</CardTitle>
        <CardDescription>Create a new booking by selecting an artist, promoter, venue, and date.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an artist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The artist who will perform at this booking.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promoterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promoter</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a promoter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {promoters.map((promoter) => (
                        <SelectItem key={promoter.id} value={promoter.id}>
                          {promoter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The promoter organizing this event.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The venue where the event will take place.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>The date of the event.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>The fee for the artist.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Create Booking
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
