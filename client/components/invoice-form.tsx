"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchBookings } from "@/lib/features/bookings/bookingsSlice"
import { createInvoice } from "@/lib/features/invoices/invoicesSlice"
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
  bookingId: z.string({
    required_error: "Please select a booking.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least $1.",
  }),
  dueDate: z.date({
    required_error: "Please select a due date.",
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function InvoiceForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const { items: bookings, status: bookingsStatus } = useAppSelector((state) => state.bookings)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      dueDate: addDays(new Date(), 30), // Default due date is 30 days from now
      notes: "",
    },
  })

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  // Update the amount when a booking is selected
  const handleBookingChange = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking) {
      setSelectedBooking(booking)
      form.setValue("amount", booking.fee)
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!selectedBooking) return

    try {
      setIsLoading(true)
      await dispatch(
        createInvoice({
          ...values,
          dueDate: values.dueDate.toISOString(),
          id: crypto.randomUUID(),
          bookingId: selectedBooking.id,
          artistName: selectedBooking.artistName,
          promoterName: selectedBooking.promoterName,
          status: "draft",
          sentDate: null,
          paidDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      ).unwrap()

      toast({
        title: "Invoice created",
        description: "The invoice has been created successfully.",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter only confirmed bookings that don't have invoices yet
  const eligibleBookings = bookings.filter((booking) => booking.status === "confirmed" && !booking.hasInvoice)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
        <CardDescription>Generate an invoice for a confirmed booking.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bookingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking</FormLabel>
                  <Select
                    disabled={bookingsStatus === "loading" || eligibleBookings.length === 0}
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleBookingChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a booking" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eligibleBookings.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No eligible bookings found
                        </SelectItem>
                      ) : (
                        eligibleBookings.map((booking) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            {booking.artistName} at {booking.venueName} ({format(new Date(booking.date), "MMM d, yyyy")}
                            )
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {eligibleBookings.length === 0
                      ? "There are no confirmed bookings without invoices. Confirm a booking first."
                      : "Select a confirmed booking to create an invoice for."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedBooking && (
              <>
                <div className="rounded-md border p-4 bg-muted/20">
                  <h3 className="font-medium mb-2">Booking Details</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Artist:</span>
                      <span className="font-medium">{selectedBooking.artistName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Promoter:</span>
                      <span className="font-medium">{selectedBooking.promoterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Venue:</span>
                      <span className="font-medium">{selectedBooking.venueName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{format(new Date(selectedBooking.date), "MMMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        This amount is pre-filled with the booking fee, but you can adjust it if needed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
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
                      <FormDescription>The date by which payment is due.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes or payment instructions..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading || bookingsStatus === "loading" || eligibleBookings.length === 0 || !selectedBooking
                }
              >
                {isLoading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
