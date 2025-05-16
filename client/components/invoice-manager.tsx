"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Mail, RefreshCw, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchInvoices, markInvoicePaid, sendInvoice } from "@/lib/features/invoices/invoicesSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

export function InvoiceManager() {
  const dispatch = useAppDispatch()
  const { items, status } = useAppSelector((state) => state.invoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchInvoices())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchInvoices())
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleResendInvoice = async (id: string) => {
    try {
      setIsLoading(true)
      await dispatch(sendInvoice(id)).unwrap()

      toast({
        title: "Invoice resent",
        description: "The invoice has been resent successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkPaid = async (id: string) => {
    try {
      setIsLoading(true)
      await dispatch(markInvoicePaid(id)).unwrap()

      toast({
        title: "Invoice marked as paid",
        description: "The invoice has been marked as paid successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark invoice as paid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInvoices = searchTerm
    ? items.filter(
        (invoice) =>
          invoice.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.promoterName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : items

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Sent
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Invoices</CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-8" value={searchTerm} onChange={handleSearch} />
          </div>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <motion.tr key={invoice.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <TableCell>{invoice.artistName}</TableCell>
                      <TableCell>{invoice.promoterName}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {invoice.sentDate ? format(new Date(invoice.sentDate), "MMM d, yyyy") : "Not sent"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvoice(invoice.id)}
                            disabled={isLoading || invoice.status === "draft" || invoice.status === "paid"}
                          >
                            <Mail className="mr-1 h-3 w-3" /> Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkPaid(invoice.id)}
                            disabled={isLoading || invoice.status === "paid"}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
