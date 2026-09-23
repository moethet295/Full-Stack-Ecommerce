import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { passwordUpdateSchema } from "@/Schema/User";
import { toast } from "@/components/ui/toast";
import { useState } from "react";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// API mutation ကို သင့် userApi ထဲက password mutation နာမည်နဲ့ ပြောင်းပါ
import { usePasswordUpdateMutation } from "@/store/slices/userApi";

type FormInput = z.infer<typeof passwordUpdateSchema>;

function PasswordUpdateForm() {
  const [isUpdated, setIsUpdated] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [passwordUpdate, { isLoading }] = usePasswordUpdateMutation();


const onSubmit: SubmitHandler<FormInput> = async (data) => {
  try {
    await passwordUpdate(data).unwrap();

    toast.add({
      title: "Password Updated",
      description: "Password updated successfully!",
      type: "success",
    });

    setIsUpdated(true);

    form.reset({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error: any) {
    toast.add({
      title: "Password Update Failed",
      description:
        error?.data?.message || "Failed to update password",
      type: "error",
    });

    console.error(error);
  }
};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Update Password</CardTitle>

        <CardDescription>
          You can update your password here.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-col gap-5">

            {/* Old Password */}
            <div className="w-full space-y-2">
              <Label htmlFor="oldPassword">
                Current Password
              </Label>

              <Input
                id="oldPassword"
                type="password"
                placeholder="Enter current password"
                {...form.register("oldPassword")}
                className="h-10 w-full"
              />

              {form.formState.errors.oldPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="w-full space-y-2">
              <Label htmlFor="newPassword">
                New Password
              </Label>

              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                {...form.register("newPassword")}
                className="h-10 w-full"
              />

              {form.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm New Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...form.register("confirmPassword")}
                className="h-10 w-full"
              />

              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || isUpdated}
                className="h-10 w-full sm:w-40"
              >
                {isLoading
                  ? "Updating..."
                  : isUpdated
                  ? "Updated"
                  : "Update Password"}
              </Button>
            </div>

          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PasswordUpdateForm;