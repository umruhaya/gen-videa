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
    }),
})


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
                form.setError("email", {
                    type: "manual",
                    message: "Email already exists.",
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

    function onInvalidSubmit(errors: FieldErrors<z.infer<typeof formSchema>>) {
        form.setError("root", {
            type: "manual",
            message: "Invalid email or password.",
        })
    }

    return (
        <>
        <nav className="Nav px-1 py-0 flex justify-between items-center w-full">
            <div>
                <h4 className="text-2xl md:text-5xl font-bold dark:text-white">
                    GenVidea
                </h4>
            </div>

            <div className="flex items-center">
                <a href="/">
                    <button className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
                        Home
                    </button>
                    <button className="text-white ml-4 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors">
                        <i className="fas fa-cog"></i>
                    </button>
                </a>
            </div>
        </nav><Form {...form}>
                <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} className="md:w-96 p-8 bg-secondary">
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
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*********" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <Button className="mt-4" type="submit">Submit</Button>
                </form>
            </Form></>
    )
}
