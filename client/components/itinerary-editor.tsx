"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { updateBooking } from "@/lib/features/bookings/bookingsSlice"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import type { Booking } from "@/lib/features/bookings/bookingsSlice"

const itineraryItemSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  location: z.string().optional(),
  type: z.enum(["travel", "soundcheck", "performance", "media", "other"]),
})

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  items: z.array(itineraryItemSchema).min(1, {
    message: "At least one itinerary item is required.",
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ItineraryEditor({ booking }: { booking: Booking }) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(booking.date),
      items: [
        {
          time: "12:00",
          description: "Arrival at venue",
          location: "",
          type: "travel",
        },
      ],
      notes: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      await dispatch(
        updateBooking({
          id: booking.id,
          data: {
            hasItinerary: true,
            // In a real app, you would save the itinerary data to a separate endpoint
            // and just mark the booking as having an itinerary
          },
        }),
      ).unwrap()

      toast({
        title: "Itinerary saved",
        description: "The itinerary has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addItineraryItem = () => {
    const currentItems = form.getValues("items")
    form.setValue("items", [
      ...currentItems,
      {
        time: "",
        description: "",
        location: "",
        type: "other",
      },
    ])
  }

  const removeItineraryItem = (index: number) => {
    const currentItems = form.getValues("items")
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itinerary</CardTitle>
        <CardDescription>Create an itinerary for this booking.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>The date of the itinerary.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Itinerary Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryItem}>
                  <Plus className="mr-1 h-4 w-4" /> Add Item
                </Button>
              </div>
              {form.watch("items").map((_, index) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItineraryItem(index)}
                      disabled={form.watch("items").length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-2 grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input placeholder="HH:MM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="soundcheck">Soundcheck</SelectItem>
                              <SelectItem value="performance">Performance</SelectItem>
                              <SelectItem value="media">Media</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.location`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Location (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes or instructions..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Itinerary"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
