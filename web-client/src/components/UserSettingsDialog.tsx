import { useStore } from '@nanostores/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { $isUserSettingsDialogOpen, $userSettings } from '@/store';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Toaster } from './ui/toaster';


type Props = {
    invalidate: () => void
}

const formSchema = z.object({
    username: z.string().min(3).max(32),
});

export default function UserSettingsDialog({invalidate} : Props) {
    const isOpen = useStore($isUserSettingsDialogOpen);
    const settings = useStore($userSettings);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: any) => {
        const response = await fetch("/api/profile/user-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            $userSettings.set({ ...settings, ...data });
            $isUserSettingsDialogOpen.set(false);
            toast({
                title: "Settings updated successfully.",
                description: "Your username has been updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
          
            //retching the user settings after the update
            invalidate();
        } else {
            $userSettings.set({ ...settings, state: "error" });
            toast({
                title: "Failed to update settings.",
                description: "Your username could not be updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
        }
    }

    const onInvalidSubmit = (errors: any) => {
        if (errors.username) {
            toast({
                title: "Validation Error",
                description: errors.username.message,
                action: <ToastAction altText="Close">Close</ToastAction>,
            });
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open : any) => $isUserSettingsDialogOpen.set(open)}>
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
                <Input id="username" {...register("username")} defaultValue={settings.username} placeholder='FunkyRabbit' />
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit(onSubmit, onInvalidSubmit)}>Save</Button>
                </DialogFooter>
            </DialogContent>
            <Toaster />
        </Dialog>
        </>
    );
}
