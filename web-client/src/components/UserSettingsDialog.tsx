import { useStore } from '@nanostores/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { isUserSettingsDialogOpen, userSettings } from '@/store';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



const formSchema = z.object({
    username: z.string().min(3).max(32),
});

export default function UserSettingsDialog() {
    const $isOpen = useStore(isUserSettingsDialogOpen);
    const $settings = useStore(userSettings);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onValidSubmit = async (data: any) => {
        const response = await fetch("/api/profile/user-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            userSettings.set({ ...$settings, ...data });
            isUserSettingsDialogOpen.set(false);
            toast({
                title: "Settings updated successfully.",
                description: "Your username has been updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
        } else {
            userSettings.set({ ...$settings, state: "error" });
            toast({
                title: "Failed to update settings.",
                description: "Your username could not be updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
        }
    }

    const onInvalidSubmit = (errors: any) => {
        // Assuming you have a way to display error messages under the Input components.
        // You would set the errors using the `setError` method from `react-hook-form`.
        // Example:
        if (errors.username) {
            toast({
                title: "Validation Error",
                description: errors.username.message,
                action: <ToastAction altText="Close">Close</ToastAction>,
            });
        }

        // Note: The `toast` function is used to show the error message using your toast notification system.
        // Replace this with your own method of displaying error messages if needed.
    };

    return (
        <>
            <Dialog open={$isOpen} onOpenChange={(open: any) => isUserSettingsDialogOpen.set(open)}>
                <DialogTrigger asChild>
                    <Button>Settings</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
                        <DialogHeader>
                            <DialogTitle>User Settings</DialogTitle>
                        </DialogHeader>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register("username")} defaultValue={$settings.username} />
                        {errors.username && typeof errors.username.message === 'string' && (
                            <p>{errors.username.message}</p>
                        )}

                        <DialogFooter>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
