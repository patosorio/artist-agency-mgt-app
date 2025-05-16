"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
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
import { Textarea } from "@/components/ui/textarea"
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
  eventDate: z.date({
    required_error: "Please select an event date.",
  }),
  fee: z.coerce.number().min(1, {
    message: "Fee must be at least $1.",
  }),
  depositAmount: z.coerce.number().min(0, {
    message: "Deposit amount must be at least $0.",
  }),
  depositDueDate: z.date({
    required_error: "Please select a deposit due date.",
  }),
  specialTerms: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ContractForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const { items: artists, status: artistsStatus } = useAppSelector((state) => state.artists)
  const { items: promoters, status: promotersStatus } = useAppSelector((state) => state.promoters)
  const { items: venues, status: venuesStatus } = useAppSelector((state) => state.venues)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee: 0,
      depositAmount: 0,
      specialTerms: "",
    },
  })

  useEffect(() => {
    dispatch(fetchArtists())
    dispatch(fetchPromoters())
    dispatch(fetchVenues())
  }, [dispatch])

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      // In a real app, this would call a createContract action
      // For now, we'll just simulate a successful creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Contract created",
        description: "The contract has been created successfully.",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isDataLoading = artistsStatus === "loading" || promotersStatus === "loading" || venuesStatus === "loading"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Contract</CardTitle>
        <CardDescription>Create a new contract for an upcoming event.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="artistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <Select disabled={isDataLoading} onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select disabled={isDataLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a promoter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {promoters.map((promoter) => (
                            <SelectItem key={promoter.id} value={promoter.id}>
                              {promoter.name} ({promoter.company})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select disabled={isDataLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a venue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {venues.map((venue) => (
                            <SelectItem key={venue.id} value={venue.id}>
                              {venue.name} ({venue.city}, {venue.state})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Financial Terms</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Fee ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="depositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="depositDueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deposit Due Date</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="specialTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Terms & Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any special terms or conditions for this contract..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any additional requirements, rider details, or special arrangements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Contract"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
