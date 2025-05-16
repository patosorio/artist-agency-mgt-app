"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, Upload } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import type { Booking } from "@/lib/features/bookings/bookingsSlice"

const expenseItemSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  amount: z.coerce.number().min(0.01, {
    message: "Amount must be greater than 0.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  category: z.enum(["travel", "accommodation", "food", "equipment", "other"]),
  receipt: z.string().optional(),
})

const formSchema = z.object({
  expenses: z.array(expenseItemSchema).min(1, {
    message: "At least one expense item is required.",
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ExpenseLogger({ booking }: { booking: Booking }) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenses: [
        {
          date: new Date(),
          amount: 0,
          description: "",
          category: "travel",
          receipt: "",
        },
      ],
      notes: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      // In a real app, you would save the expense data to a separate endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Expenses saved",
        description: "Your expenses have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expenses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addExpenseItem = () => {
    const currentExpenses = form.getValues("expenses")
    form.setValue("expenses", [
      ...currentExpenses,
      {
        date: new Date(),
        amount: 0,
        description: "",
        category: "other",
        receipt: "",
      },
    ])
  }

  const removeExpenseItem = (index: number) => {
    const currentExpenses = form.getValues("expenses")
    if (currentExpenses.length > 1) {
      form.setValue(
        "expenses",
        currentExpenses.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Logger</CardTitle>
        <CardDescription>Log expenses related to this booking.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Expenses</h3>
                <Button type="button" variant="outline" size="sm" onClick={addExpenseItem}>
                  <Plus className="mr-1 h-4 w-4" /> Add Expense
                </Button>
              </div>
              {form.watch("expenses").map((_, index) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Expense {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpenseItem(index)}
                      disabled={form.watch("expenses").length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-2 grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.date`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="accommodation">Accommodation</SelectItem>
                              <SelectItem value="food">Food & Drinks</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
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
                      name={`expenses.${index}.receipt`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Receipt (optional)</FormLabel>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                // In a real app, this would open a file picker
                                toast({
                                  title: "Upload receipt",
                                  description: "This would open a file picker in a real app.",
                                })
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Receipt
                            </Button>
                            {field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => form.setValue(`expenses.${index}.receipt`, "")}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          {field.value && (
                            <p className="mt-1 text-sm text-muted-foreground">{field.value.split("/").pop()}</p>
                          )}
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
                      placeholder="Any additional notes about these expenses..."
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
                {isLoading ? "Saving..." : "Save Expenses"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
