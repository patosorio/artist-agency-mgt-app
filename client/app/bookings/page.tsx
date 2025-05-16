"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector } from "@/lib/hooks"
import { BookingDashboard } from "@/components/booking-dashboard"
import { BookingForm } from "@/components/booking-form"
import { ContractViewer } from "@/components/contract-viewer"
import { ItineraryEditor } from "@/components/itinerary-editor"
import { ExpenseLogger } from "@/components/expense-logger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookingsPage() {
  const [showNewBookingForm, setShowNewBookingForm] = useState(false)
  const { selectedBooking } = useAppSelector((state) => state.bookings)

  const handleNewBooking = () => {
    setShowNewBookingForm(true)
  }

  const handleBookingCreated = () => {
    setShowNewBookingForm(false)
  }

  const handleCancel = () => {
    setShowNewBookingForm(false)
  }

  return (
    <div className="container mx-auto py-6">
      <AnimatePresence mode="wait">
        {showNewBookingForm ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BookingForm onSuccess={handleBookingCreated} onCancel={handleCancel} />
          </motion.div>
        ) : selectedBooking ? (
          <motion.div
            key="booking-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Tabs defaultValue="contract">
              <TabsList className="mb-4">
                <TabsTrigger value="contract">Contract</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
              <TabsContent value="contract">
                <ContractViewer booking={selectedBooking} />
              </TabsContent>
              <TabsContent value="itinerary">
                <ItineraryEditor booking={selectedBooking} />
              </TabsContent>
              <TabsContent value="expenses">
                <ExpenseLogger booking={selectedBooking} />
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            key="booking-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BookingDashboard onNewBooking={handleNewBooking} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
