import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    useCurrentUserQuery,
    useUploadAvatarMutation,
} from "@/store/slices/userApi";

import { useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import EmailUpdateForm from "@/component/profile/emailUpdateForm";
import NameUpdateForm from "@/component/profile/nameUpdateForm";
import { Loader } from "lucide-react";
import PasswordUpdateForm from "@/component/profile/passwordUpdateForm";
import ResetPasswordForm from "@/component/profile/resetPasswordForm";

function Profile() {
    const { data: user, refetch,isLoading } = useCurrentUserQuery();

    const [avatar, setAvatar] = useState<string | null>(null);
    const [uploadAvatarMutation, { isLoading: isMutating }] =
        useUploadAvatarMutation();

    const inputRef = useRef<HTMLInputElement | null>(null);

    // =========================
    // Select Image
    // =========================
    const imageOnChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Allow only image
        if (!file.type.startsWith("image/")) {
            toast.add({
                type: "error",
                title: "Invalid File",
                description: "Please select an image file.",
            });

            e.target.value = "";
            return;
        }

        // Maximum 5MB
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.add({
                type: "error",
                title: "File Too Large",
                description: "Please select an image smaller than 5MB.",
            });

            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setAvatar(reader.result as string);
        };

        reader.onerror = () => {
            toast.add({
                type: "error",
                title: "Error",
                description: "Failed to read image.",
            });
        };

        reader.readAsDataURL(file);
    };

    // =========================
    // Upload Avatar
    // =========================
    const avatarUploadHandler = async () => {
    if (!avatar) {
        toast.add({
            type: "error",
            title: "Avatar Required",
            description: "Please select an avatar first.",
        });
        return;
    }

    try {
        await uploadAvatarMutation({
            image_url: avatar,
        }).unwrap();

        console.log("UPLOAD SUCCESS");

        toast.add({
            type: "success",
            title: "Upload Successful",
            description: "Avatar uploaded successfully.",
        });

        setAvatar(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        await refetch();

    } catch (error: any) {
        console.error("UPLOAD ERROR =>", error);

        const message =
            error?.data?.errors?.[0]?.msg ||
            error?.data?.message ||
            "Failed to upload avatar.";

        toast.add({
            type: "error",
            title: "Upload Failed",
            description: message,
        });
    }
};

    return (
        <>
        {isLoading ? (<Loader/>) : 
        (  
            <section className="space-y-4">

            <Card className="w-full">

                <CardHeader>
                    <CardTitle>Profile</CardTitle>

                    <CardDescription>
                        Upload your profile avatar
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex items-center justify-between gap-6">

                    {/* Avatar + File Input */}
                    <div className="flex items-center gap-4">

                        <Avatar className="h-16 w-16">

                            <AvatarImage
                                src={
                                    avatar ||
                                    user?.avator?.url ||
                                    ""
                                }
                                alt={user?.name || "User avatar"}
                            />

                            <AvatarFallback>
                                {user?.name
                                    ?.slice(0, 1)
                                    .toUpperCase() || "U"}
                            </AvatarFallback>

                        </Avatar>

                        <div>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={imageOnChangeHandler}
                                className="w-full rounded-md border p-2"
                                disabled={isLoading}
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                JPG, PNG or WEBP. Max 5MB.
                            </p>
                        </div>

                    </div>

                    {/* Upload Button */}
                    <button
                        type="button"
                        onClick={avatarUploadHandler}
                        disabled={isMutating || !avatar}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </button>

                </CardContent>
            </Card>
            <div className="flex gap-5"> 
                    <EmailUpdateForm email={user?.email!} />  
                    <NameUpdateForm name={user?.name!}/> 
             </div>        
             <PasswordUpdateForm />
             <ResetPasswordForm email={user?.email!} />
        </section>
        )} 

        </>
    );
}

export default Profile;