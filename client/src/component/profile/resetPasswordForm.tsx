import { useForgotPasswordMutation } from "@/store/slices/userApi";
import { toast } from "@/components/ui/toast";

interface ResetPasswordProps {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ApiError {
  data?: {
    message?: string;
  };
}

function ResetPasswordForm({ email }: ResetPasswordProps) {
  const [forgotpasswordMutation, { isLoading }] =
    useForgotPasswordMutation();

  const changePasswordHandler = async () => {
    try {
      const res = (await forgotpasswordMutation({
        email,
      }).unwrap()) as ForgotPasswordResponse;

      toast.add({
        title: "Success",
        description:
          res.message ||
          "Password reset email sent successfully",
        type: "success",
      });
    } catch (error: unknown) {
      const err = error as ApiError;

      toast.add({
        title: "Error",
        description:
          err?.data?.message ||
          "Failed to send password reset email",
        type: "error",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={changePasswordHandler}
      disabled={isLoading}
      className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Sending..." : "Change Password"}
    </button>
  );
}

export default ResetPasswordForm;