"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Music, Upload } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { createArtist } from "@/lib/features/artists/artistsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Artist name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  genre: z.string({
    required_error: "Please select a genre.",
  }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  imageUrl: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ArtistForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      genre: "",
      bio: "",
      imageUrl: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      await dispatch(
        createArtist({
          ...values,
          id: crypto.randomUUID(), // In a real app, the backend would generate this
          imageUrl: previewImage || "/diverse-artists-studio.png",
        }),
      ).unwrap()

      toast({
        title: "Artist created",
        description: "The artist has been created successfully.",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create artist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    // For now, we'll just set a placeholder image
    const placeholderImages = [
      "/diverse-musician-ensemble.png",
      "/dj-at-turntables.png",
      "/diverse-group.png",
      "/diverse-woman-portrait.png",
      "/thoughtful-man.png",
    ]
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
    setPreviewImage(randomImage)
    form.setValue("imageUrl", randomImage)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Artist</CardTitle>
        <CardDescription>Create a new artist profile for your agency.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={previewImage || "/placeholder.svg?height=80&width=80&query=artist"} alt="Artist" />
                <AvatarFallback>
                  <Music className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rock">Rock</SelectItem>
                        <SelectItem value="pop">Pop</SelectItem>
                        <SelectItem value="electronic">Electronic</SelectItem>
                        <SelectItem value="hiphop">Hip Hop</SelectItem>
                        <SelectItem value="jazz">Jazz</SelectItem>
                        <SelectItem value="classical">Classical</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="artist@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Artist biography and background..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormDescription>Briefly describe the artist's background, achievements, and style.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Artist"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
