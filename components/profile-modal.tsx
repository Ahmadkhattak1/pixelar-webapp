"use client";

import { useState } from "react";
import { LogOut, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BYOKButton } from "@/components/home/BYOKButton";

export function ProfileModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuthContext();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            setIsOpen(false);
            router.push("/login");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden gap-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>User Profile</DialogTitle>
                    <DialogDescription>Manage your account settings</DialogDescription>
                </DialogHeader>
                <div className="h-32 bg-primary/20 w-full relative" />

                <div className="px-6 pb-6 -mt-12 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-xl bg-background p-1 shadow-lg mb-4">
                            <div className="w-full h-full rounded-lg bg-primary p-[1px]">
                                <img
                                    src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                    alt={user.displayName || "User"}
                                    className="w-full h-full rounded-[7px] bg-black object-cover"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-text">{user.displayName || "User"}</h2>
                        <div className="flex items-center gap-1.5 text-sm text-text-muted mt-1">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{user.email}</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="p-3 rounded-lg border border-border bg-background/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Key className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-sm">API Key</div>
                                        <div className="text-xs text-text-muted">Bring your own key</div>
                                    </div>
                                </div>
                                <BYOKButton />
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
