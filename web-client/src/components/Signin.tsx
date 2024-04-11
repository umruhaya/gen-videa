// Import statements for necessary libraries, hooks, components, and type definitions
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

// Define a Zod schema for form validation
const formSchema = z.object({
    email: z.string().email(), // Email must be a valid email string
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.", // Password must be at least 8 characters long
    }),
})


export default function SignInComponent() {
    // Initialize toast notifications
    const { toast } = useToast()


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Display a toast notification for successful signup redirection
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

        // Submit form data to the authentication API endpoint
        const formData = new FormData()
        formData.append("email", values.email)
        formData.append("password", values.password)
        const response = await fetch("/api/auth/token", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()

        // Handle response status for success, unauthorized, or other errors
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

    // Handle form submission with invalid data
    function onInvalidSubmit(errors: FieldErrors<z.infer<typeof formSchema>>) {
        form.setError("root", {
            type: "manual",
            message: "Invalid email or password.",
        })
    }

    // Render the sign-in form UI
    return (
        <>

            <section className="w-screen h-screen grid place-items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} className="md:w-96 p-8 bg-secondary">
                        <h1 className="text-bold text-4xl mb-8">
                            Sign In
                        </h1>
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

                        <Button data-testid="signin-btn" className="mt-4" type="submit">Submit</Button>
                    </form>
                </Form>
                <div>
                    <style>{`
                .signup-link {
                    color: #1f9eff;
                    text-decoration: underline;
                }

                .signup-link:hover {
                    color: #0060a9;
                    text-decoration: none;
                }
            `}</style>

                    <div>
                        <p>Don't have an account?{' '}
                            <a href="/signup" className="signup-link">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>

            </section>
            <Toaster />
        </>
    )
}