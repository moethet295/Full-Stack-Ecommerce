import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { emailUpdateSchema } from "@/Schema/User";
import { Button } from "@/components/ui/button";
import { useEmailUpdateMutation } from "@/store/slices/userApi";
import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface EmailUpdateFormProps {
  email: string;
}

type FormInput = z.infer<typeof emailUpdateSchema>;

function EmailUpdateForm({ email }: EmailUpdateFormProps) {
  const [isUpdated, setIsUpdated] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      email,
    },
  });

  const currentEmail = form.watch("email");

  const [emailUpdateMutation, { isLoading }] =
    useEmailUpdateMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const result = await emailUpdateMutation(data).unwrap();

      console.log("EMAIL UPDATE RESULT =", result);

      toast.add({
        title: "Email Updated",
        description: "Your email has been updated successfully.",
      });

      // Update success ဖြစ်ရင် Updated state ပြောင်းမယ်
      setIsUpdated(true);

      // Form ကို updated email နဲ့ reset လုပ်မယ်
      form.reset({
        email: data.email,
      });
    } catch (err: any) {
      console.error("EMAIL UPDATE ERROR =", err);

      toast.add({
        type: "error",
        title: "Update Failed",
        description:
          err?.data?.message ||
          "Failed to update your email. Please try again.",
        priority: "high",
      });
    }
  };

  // Parent က email အသစ်ပြန်ပို့လာရင် form update လုပ်မယ်
  useEffect(() => {
    form.reset({
      email,
    });

    setIsUpdated(false);
  }, [email, form]);

  // Updated ဖြစ်ပြီးနောက် user က email ကို ပြန်ပြင်ရင်
  // Update button ကို ပြန်အသုံးပြုနိုင်အောင်လုပ်မယ်
  useEffect(() => {
    if (currentEmail !== email) {
      setIsUpdated(false);
    }
  }, [currentEmail, email]);

  return (
    <Card className="w-full">
      <CardTitle className="pl-6">
        Email
      </CardTitle>

      <CardDescription className="pl-6">
        You can view or edit your email address.
      </CardDescription>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

            {/* Email */}
            <div className="w-full space-y-2 sm:max-w-md">
              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                className="h-10 w-full"
              />

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Update Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                isUpdated ||
                currentEmail === email
              }
              className="h-10 w-full sm:w-35"
            >
              {isLoading
                ? "Updating..."
                : isUpdated
                  ? "Updated"
                  : "Update Email"}
            </Button>

          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default EmailUpdateForm;