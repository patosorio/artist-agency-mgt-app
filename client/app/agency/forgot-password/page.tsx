"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)

      // In a real app, this would call an API to send a password reset email
      // For now, we'll just simulate a successful request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)

      toast({
        title: "Reset link sent",
        description: "If an account exists with that email, you will receive a password reset link.",
      })
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight mb-4">Reset your password</h2>

      {isSubmitted ? (
        <div className="text-center">
          <p className="mb-4">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn't receive an email?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => setIsSubmitted(false)}>
              Try again
            </Button>
          </p>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email address associated with your account and we'll send you a link to reset your
                      password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Back to login
            </Link>
          </div>
        </>
      )}
    </>
  )
}
