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

const formSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
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


export default function SignUpComponent() {
    // Sets up the form using react-hook-form with Zod for complex validations, including multifaceted password rules.
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    // Watches for changes to the password input to dynamically validate and provide user feedback.
    const watchedPassword = form.watch("password")

    // Submits form data to the server and handles the response to redirect or display errors based on server feedback.
    // 2. Define a submit handler.
    async function onValidSubmit(values: z.infer<typeof formSchema>, e?: BaseSyntheticEvent<object, any, any>) {

        e?.preventDefault()

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })

        const data = await response.json()

        switch (response.status) {
            case 201:
                window.location.href = "/signin?signup=success"
                break
            case 409:
                form.setError(data["detail"].includes("Email") ? "email" : "username", {
                    type: "manual",
                    message: data["detail"],
                })
                break
            case 422:
                form.setError("password", {
                    type: "manual",
                    message: data.detail[0].msg,
                })
                break
        }
    }

    // Displays error messages if form validation fails on submission attempt.
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
