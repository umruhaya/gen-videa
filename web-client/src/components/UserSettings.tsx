import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, type FieldErrors } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { BaseSyntheticEvent } from "react"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "./ui/toaster"


const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).max(32, {
    message: "Username must be at most 32 characters.",
  }),
})


export default function SignInComponent() {

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  // 2. Define a submit handler.
  async function onValidSubmit(values: z.infer<typeof formSchema>, e?: BaseSyntheticEvent<object, any, any>) {

    e?.preventDefault()

    const response = await fetch("/api/profile/user-settings", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (response.ok) {
      const data = await response.json()
      console.debug(data)
      toast({
        title: "Action Successful.",
        description: `Your username was updated to ${form.getValues("username")}`,
        action: (
          <ToastAction altText="Ack">Ok</ToastAction>
        )
      })
      return
    }

    switch (response.status) {
      case 409:
        window.location.reload()
        break
      case 422:
        console.debug(response)
        break
    }
  }

  function onInvalidSubmit(errors: FieldErrors<z.infer<typeof formSchema>>) {
    form.setError("username", {
      type: "manual",
      message: errors.username?.message,
    })
  }

  return (
    <>

      <section className="grid place-items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} className="md:w-96 p-8 bg-secondary">
            <a href="/dashboard"><p className="text-sm underline">Go Back to Dashboard</p></a>
            <h1 className="text-bold text-4xl mb-8">
              Update User Settings
            </h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="FunkyRabit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4" type="submit">Save</Button>
          </form>
        </Form>
      </section>
      <Toaster />
    </>
  )
}
