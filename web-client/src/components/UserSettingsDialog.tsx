import { useStore } from '@nanostores/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { $isUserSettingsDialogOpen } from '@/store';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { queryClient } from '@/store/query-client';

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
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Spinner from '@/components/Spinner';
import { useEffect } from 'react';


type Props = {
    invalidate: () => void
}

// Define user settings form validation schema using zod.
const formSchema = z.object({
    username: z.string().min(3).max(32),
    bio: z.string().max(256),
});

type UserSettingsData = {
    email: string;
    username: string;
    bio: string;
    profile_picture: string;
}

export default function UserSettingsDialog({ invalidate }: Props) {
    const isOpen = useStore($isUserSettingsDialogOpen);
    const { toast } = useToast();

    // Query for fetching user settings.
    const { data: settingsData, refetch } = useQuery<UserSettingsData>({
        queryKey: ["userSettings"],
        queryFn: () => axios.get("/api/profile/user-settings").then(res => res.data),
    }, queryClient)

    // Mutation for updating user settings.
    const settingsMutation = useMutation<UserSettingsData, Error, Partial<UserSettingsData>, unknown>({
        mutationKey: ["update-profile-picture"],
        mutationFn: (data) => axios.post("/api/profile/user-settings", data).then(res => res.data),
        onSuccess: (data) => {
            $isUserSettingsDialogOpen.set(false);
            toast({
                title: "Settings updated successfully.",
                description: "Your username has been updated.",
                action: <ToastAction altText="Ack">Ok</ToastAction>
            });
            // Refresh user settings
            invalidate();
        },
        onError: (error) => {
            const message = error.message.includes("409") ? "Username already exists" : error.message
            toast({
                title: "Error",
                description: message,
                action: <ToastAction altText="Close">Close</ToastAction>
            });
        }
    }, queryClient)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    // Effect to populate form fields when user settings are loaded.
    useEffect(() => {
        if (!settingsData) return;
        setValue("username", settingsData.username)
        setValue("bio", settingsData.bio)
    }, [settingsData])

    const onSubmit = (data: Partial<UserSettingsData>) => {
        settingsMutation.mutate(data);
    }

    const onInvalidSubmit = (errors: any) => {
        if (errors.username) {
            toast({
                title: "Validation Error",
                description: errors.username.message,
                action: <ToastAction altText="Close">Close</ToastAction>,
            });
        }
        if (errors.bio) {
            toast({
                title: "Validation Error",
                description: errors.bio.message,
                action: <ToastAction altText="Close">Close</ToastAction>,
            });
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open: any) => $isUserSettingsDialogOpen.set(open)}>
                <DialogTrigger>
                    <SettingsIcon size={24} />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Settings</DialogTitle>
                        <DialogDescription>
                            Update your username
                        </DialogDescription>
                    </DialogHeader>
                    <Label htmlFor="username">New Username</Label>
                    <Input id="username" {...register("username")} placeholder='FunkyRabbit' />
                    <Label htmlFor="bio">New Bio</Label>
                    <Input id="bio" {...register("bio")} placeholder='Hey There! I am using Genvidea' />
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit(onSubmit, onInvalidSubmit)}>
                            {settingsMutation.isPending ? <Spinner /> : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
                <Toaster />
            </Dialog>
        </>
    );
}
