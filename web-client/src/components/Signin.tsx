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
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})


export default function SignInComponent() {

    const { toast } = useToast()


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const signupSuccess = searchParams.get("signup") === "success"
        if (signupSuccess) {
            toast({
                title: "Signed up successfully.",
                description: "You can now sign in with your new account.",
                action: (
                    <ToastAction altText="Ack">Lezgo</ToastAction>
                ),
            })
        }
    }, [])

    // 2. Define a submit handler.
    async function onValidSubmit(values: z.infer<typeof formSchema>, e?: BaseSyntheticEvent<object, any, any>) {

        e?.preventDefault()

        const formData = new FormData()
        formData.append("email", values.email)
        formData.append("password", values.password)
        const response = await fetch("/api/auth/token", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()

        switch (response.status) {
            case 200:
                window.location.reload()
                break
            case 401:
                form.setError("password", {
                    type: "manual",
                    message: "Invalid email or password.",
                })
                break
            case 422:
                console.debug(response)
                break
        }
    }

    function onInvalidSubmit(errors: FieldErrors<z.infer<typeof formSchema>>) {
        form.setError("root", {
            type: "manual",
            message: "Invalid email or password.",
        })
    }

    return (
        <>
            <section className="w-screen h-screen grid place-items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} className="md:w-96 p-8 bg-secondary">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="*********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="mt-4" type="submit">Submit</Button>
                    </form>
                </Form>
            </section>
            <Toaster />
        </>
    )
}
