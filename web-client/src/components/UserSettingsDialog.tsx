// Imports for necessary hooks, libraries, and components
import { useStore } from '@nanostores/react'; // State management for React apps
import { useForm } from 'react-hook-form'; // Simplifies form handling in React
import { zodResolver } from '@hookform/resolvers/zod'; // Integrates Zod for schema validation with react-hook-form
import { z } from "zod"; // Schema validation library
import { isUserSettingsDialogOpen, userSettings } from '@/store'; // Application-specific stores for state management
import { useToast } from "@/components/ui/use-toast"; // Hook for displaying toast notifications
import { ToastAction } from "@/components/ui/toast" // Component for actionable toast notifications
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react"; // Icon library


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog" // Components for creating a dialog/modal
import { Toaster } from './ui/toaster'; // Component for managing toast notifications

// Type definition for props expected by the UserSettingsDialog component
type Props = {
    invalidate: () => void // Function to invalidate query or local state, triggering a refetch or update
}

// Zod schema for form validation
const formSchema = z.object({
    username: z.string().min(3).max(32), // Username must be between 3 and 32 characters
});

// Functional component definition
export default function UserSettingsDialog({invalidate} : Props) {
    const $isOpen = useStore(isUserSettingsDialogOpen); // State for dialog visibility
    const $settings = useStore(userSettings); // State for user settings
    const { toast } = useToast(); // Hook to invoke toast notifications

    // Setup form with react-hook-form and zod for validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    // Function to handle valid form submission
    const onSubmit = async (data: any) => {
        const response = await fetch("/api/profile/user-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            // On success, update user settings state and close dialog
            userSettings.set({ ...$settings, ...data });
            isUserSettingsDialogOpen.set(false);
            toast({
                title: "Settings updated successfully.",
                description: "Your username has been updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
          
            //fetching the user settings after the update
            invalidate(); // Invalidate local state or queries to refetch updated data
        } else {
            // On failure, set an error state and show a failure toast
            userSettings.set({ ...$settings, state: "error" });
            toast({
                title: "Failed to update settings.",
                description: "Your username could not be updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
        }
    }

    // Function to handle invalid form submission
    const onInvalidSubmit = (errors: any) => {
        // Show a toast notification for validation errors
        if (errors.username) {
            toast({
                title: "Validation Error",
                description: errors.username.message,
                action: <ToastAction altText="Close">Close</ToastAction>,
            });
        }
    };

    // Component render logic
    return (
        <>
            <Dialog open={$isOpen} onOpenChange={(open : any) => isUserSettingsDialogOpen.set(open)}>
            <DialogTrigger>
                <Button>
                    <SettingsIcon size={24} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Settings</DialogTitle>
                    <DialogDescription>
                        Update your username
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="username">New Username</Label>
                <Input id="username" {...register("username")} defaultValue={$settings.username} placeholder='FunkyRabbit' />
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit(onSubmit, onInvalidSubmit)}>Save</Button>
                </DialogFooter>
            </DialogContent>
            <Toaster />
        </Dialog>
        </>
    );
}
