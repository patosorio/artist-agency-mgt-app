"use client"

import { useEffect } from "react"
import { BarChart3, Calendar, CreditCard, DollarSign, FileText, Music, Plus, RefreshCw } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchBookings } from "@/lib/features/bookings/bookingsSlice"
import { fetchInvoices } from "@/lib/features/invoices/invoicesSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { items: bookings } = useAppSelector((state) => state.bookings)
  const { items: invoices } = useAppSelector((state) => state.invoices)

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchInvoices())
  }, [dispatch])

  // Calculate summary statistics
  const totalBookings = bookings?.length || 0
  const confirmedBookings = bookings?.filter?.((booking) => booking.status === "confirmed")?.length || 0
  const totalInvoices = invoices?.length || 0
  const paidInvoices = invoices?.filter?.((invoice) => invoice.status === "paid")?.length || 0
  const totalRevenue =
    invoices?.filter?.((invoice) => invoice.status === "paid")?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0
  const pendingRevenue =
    invoices?.filter?.((invoice) => invoice.status !== "paid")?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{confirmedBookings} confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">{paidInvoices} paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalInvoices - paidInvoices} unpaid invoices</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown for the current year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <BarChart3 className="h-16 w-16 text-muted" />
              <p className="ml-2 text-sm text-muted-foreground">Chart would be rendered here</p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Music className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.artistName} at {booking.venueName}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-xs font-medium">${booking.fee.toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No recent bookings</div>
              )}

              {Array.isArray(invoices) && invoices.length > 0 ? (
                invoices.slice(0, 2).map((invoice) => (
                  <div key={invoice.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Invoice for {invoice.artistName}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xs font-medium">${invoice.amount.toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No recent invoices</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
