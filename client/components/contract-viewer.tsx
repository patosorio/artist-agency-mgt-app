"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { updateBooking } from "@/lib/features/bookings/bookingsSlice"
import { sendInvoice } from "@/lib/features/invoices/invoicesSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/api"
import type { Booking } from "@/lib/features/bookings/bookingsSlice"

export function ContractViewer({ booking }: { booking: Booking }) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [contractUrl, setContractUrl] = useState<string | null>(null)

  const fetchContract = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/bookings/${booking.id}/contract`, {
        responseType: "blob",
      })

      const url = URL.createObjectURL(response.data)
      setContractUrl(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      setIsLoading(true)
      await dispatch(
        updateBooking({
          id: booking.id,
          data: {
            status: "confirmed",
          },
        }),
      ).unwrap()

      toast({
        title: "Contract approved",
        description: "The contract has been approved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendInvoice = async () => {
    try {
      setIsLoading(true)
      await dispatch(sendInvoice(booking.id)).unwrap()

      toast({
        title: "Invoice sent",
        description: "The invoice has been sent successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract</CardTitle>
        <CardDescription>View and approve the contract for this booking.</CardDescription>
      </CardHeader>
      <CardContent>
        {contractUrl ? (
          <iframe src={contractUrl} className="h-[600px] w-full rounded-md border" title="Contract PDF" />
        ) : (
          <div className="flex h-[600px] items-center justify-center rounded-md border bg-muted/50">
            <Button onClick={fetchContract} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load Contract"}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (contractUrl) {
              window.open(contractUrl, "_blank")
            }
          }}
          disabled={!contractUrl}
        >
          Download
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleApprove} disabled={isLoading || booking.status === "confirmed"}>
            {booking.status === "confirmed" ? "Approved" : "Approve"}
          </Button>
          <Button
            onClick={handleSendInvoice}
            disabled={isLoading || booking.status !== "confirmed" || booking.hasInvoice}
          >
            {booking.hasInvoice ? "Invoice Sent" : "Send Invoice"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
