import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForgotPasswordMutation } from "../store/slices/userApi";

import { toast } from "@/components/ui/toast";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");

  const [forgotPassword, { isLoading }] =
    useForgotPasswordMutation();

  const submit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const result = await forgotPassword({
        email,
      }).unwrap();

      // ✅ Success Toast
      toast.add({
        title: "Password Reset Email Sent",
        description:
          result?.message ||
          "Please check your email for the password reset link.",
      });

      // Email input ရှင်းမယ်
      setEmail("");

    } catch (error: any) {
      console.error("Forgot Password Error:", error);

      // ❌ Error Toast
      toast.add({
        type: "error",
        title: "Forgot Password Failed",
        description:
          error?.data?.message ||
          "Unable to send password reset email.",
        priority: "high",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>

        <CardHeader>
          <CardTitle>
            Forgot Password
          </CardTitle>

          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit}>
            <div className="flex flex-col gap-6">

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              {/* Forgot Password */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? "Sending..."
                  : "Forgot Password"}
              </Button>

              {/* Back to Login */}
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>

            </div>
          </form>
        </CardContent>

      </Card>
    </div>
  );
}

export default ForgotPassword;
