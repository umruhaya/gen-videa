// Import necessary utilities for form handling and validation
import { zodResolver } from "@hookform/resolvers/zod"
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

// Define the form's validation schema using Zod
const formSchema = z.object({
    username: z.string().min(3), // Username must be at least 3 characters long
    email: z.string().email(), // Email must be a valid email format
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.", // Password validations for length, characters, and special characters
    })
        // Additional password criteria validations for uppercase, lowercase, digit, and special characters
        .refine((val) => /[A-Z]/.test(val), {
            message: "Password must contain at least one uppercase letter.",
        })
        .refine((val) => /[a-z]/.test(val), {
            message: "Password must contain at least one lowercase letter.",
        })
        .refine((val) => /\d/.test(val), {
            message: "Password must contain at least one digit.",
        })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
            message: "Password must contain at least one special character.",
        }),
})

// SignUpComponent functional component definition
export default function SignUpComponent() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    const watchedPassword = form.watch("password")

    // 2. Define a submit handler.
    async function onValidSubmit(values: z.infer<typeof formSchema>, e?: BaseSyntheticEvent<object, any, any>) {

        e?.preventDefault()

        // Submit the form data to the signup API endpoint
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })

        const data = await response.json()

        // Handle different response statuses (e.g., success, email exists, validation errors)
        switch (response.status) {
            case 201: // On successful signup, redirect to the sign-in page with a success query parameter
                window.location.href = "/signin?signup=success"
                break
            case 409: // If the email already exists, set an error on the email field
                form.setError("email", {
                    type: "manual",
                    message: "Email already exists.",
                })
                break
            case 422: // Handle other validation errors from the API
                form.setError("password", {
                    type: "manual",
                    message: data.detail[0].msg,
                })
                break
        }
    }

    // Handler for submission attempts that fail validation
    function onInvalidSubmit(errors: FieldErrors<z.infer<typeof formSchema>>) {
        // Set a generic error if submission fails due to validation issues
        form.setError("root", {
            type: "manual",
            message: "Invalid email or password.",
        })
    }

    // Render the sign-up form with validation feedback for each field and password criteria
    return (
        <>
            <section className="w-screen h-screen grid place-items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} className="md:w-96 p-8 bg-secondary">
                        {/* Form fields for username, email, and password with live password criteria feedback */}

                        <h1 className="text-bold text-4xl mb-8">
                            Sign Up
                        </h1>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Umer Naeem" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

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
                            )} />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <>
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="*********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <ul style={{ marginTop: "4px" }}>
                                        <li style={{ color: watchedPassword.length >= 8 ? 'green' : 'red', fontSize: '0.6rem' }}>At least 8 characters</li>
                                        <li style={{ color: /[A-Z]/.test(watchedPassword) ? 'green' : 'red', fontSize: '0.6rem' }}>At least one uppercase letter</li>
                                        <li style={{ color: /[a-z]/.test(watchedPassword) ? 'green' : 'red', fontSize: '0.6rem' }}>At least one lowercase letter</li>
                                        <li style={{ color: /\d/.test(watchedPassword) ? 'green' : 'red', fontSize: '0.6rem' }}>At least one digit</li>
                                        <li style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword) ? 'green' : 'red', fontSize: '0.6rem' }}>At least one special character</li>
                                    </ul>
                                </>
                            )}
                        />


                        <Button className="mt-4" type="submit">Submit</Button>
                    </form>
                </Form>
                {/* Link for users who already have an account to sign in */}
                <div style={{ marginBottom: '60px' }}>
                    <style>{`
                .signin-link {
                    color: #1f9eff;
                    text-decoration: underline;
                }

                .signin-link:hover {
                    color: #0060a9;
                    text-decoration: none;
                }
            `}</style>

                    <p>Already have an account?{' '}
                        <a href="/signin" className="signin-link">
                            Sign in
                        </a>
                    </p>
                </div>
            </section>

        </>
    )
}
