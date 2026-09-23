import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameUpdateSchema } from "@/Schema/User";
import { Button } from "@/components/ui/button";
import { useNameUpdateMutation } from "@/store/slices/userApi";
import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NameUpdateFormProps {
  name: string;
}

type FormInput = z.infer<typeof nameUpdateSchema>;

function NameUpdateForm({ name }: NameUpdateFormProps) {
  const [isUpdated, setIsUpdated] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(nameUpdateSchema),
    defaultValues: {
      name,
    },
  });

  const currentName = form.watch("name");

  const [nameUpdateMutation, { isLoading }] =
    useNameUpdateMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const result = await nameUpdateMutation(data).unwrap();

      console.log("NAME UPDATE RESULT =", result);

      setIsUpdated(true);

      toast.add({
        title: "Name Updated",
        description: "Your name has been updated successfully.",
      });

      // Update form value
      form.reset({
        name: data.name,
      });
    } catch (err: any) {
      console.error("NAME UPDATE ERROR =", err);

      setIsUpdated(false);

      toast.add({
        type: "error",
        title: "Update Failed",
        description:
          err?.data?.message ||
          "Failed to update your name. Please try again.",
        priority: "high",
      });
    }
  };

  useEffect(() => {
    form.reset({
      name,
    });

    setIsUpdated(false);
  }, [name, form]);

  // User က name ပြန်ပြင်ရင် Updated state ကို ပြန်ဖျက်မယ်
  useEffect(() => {
    if (currentName !== name) {
      setIsUpdated(false);
    }
  }, [currentName, name]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Name</CardTitle>
        <CardDescription>
          You can view or edit your profile name here.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Name */}
            <div className="w-full space-y-2 sm:max-w-md">
              <Label htmlFor="name">
                Name
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...form.register("name")}
                className="h-10 w-full"
              />

              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                isUpdated ||
                currentName === name
              }
              className="h-10 w-full sm:w-35"
            >
              {isLoading
                ? "Updating..."
                : isUpdated
                ? "Updated"
                : "Update Name"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default NameUpdateForm;