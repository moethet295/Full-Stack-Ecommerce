import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { toast } from "@/components/ui/toast";

import {
  useResetPasswordMutation,
} from "@/store/slices/userApi";

// Reset password success response
interface ResetPasswordResponse {
  message?: string;
}

// API error response
interface ApiError {
  data?: {
    message?: string;
  };
}

function ResetPassword() {
  const { id: token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPasswordMutation, { isLoading }] =
    useResetPasswordMutation();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Check fields
    if (!newPassword || !confirmPassword) {
      toast.add({
        title: "Error",
        description: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      toast.add({
        title: "Error",
        description: "Passwords do not match",
        type: "error",
      });
      return;
    }

    // Check token
    if (!token) {
      toast.add({
        title: "Error",
        description: "Invalid or missing reset token",
        type: "error",
      });
      return;
    }

    try {
      const res = (await resetPasswordMutation({
        token,
        newPassword,
      }).unwrap()) as ResetPasswordResponse;

      // Clear form
      setNewPassword("");
      setConfirmPassword("");

      // Success message
      toast.add({
        title: "Success",
        description:
          res.message || "Password reset successfully!",
        type: "success",
      });

      // Go to login
      navigate("/login");
    } catch (error: unknown) {
      console.error("Reset Password Error:", error);

      const apiError = error as ApiError;

      toast.add({
        title: "Error",
        description:
          apiError.data?.message ||
          "Failed to reset password",
        type: "error",
      });
    }
  };

  return (
    <Card className="mx-auto mt-40 w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Reset Password
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password
            </Label>

            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Changing password..."
              : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ResetPassword;