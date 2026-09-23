import { useForgotPasswordMutation } from "@/store/slices/userApi";
import { toast } from "@/components/ui/toast";

interface ResetPasswordProps {
  email: string;
}

function ResetPasswordForm({ email }: ResetPasswordProps) {
  const [forgotpasswordMutation, { isLoading }] =
    useForgotPasswordMutation();

  const changePasswordHandler = async () => {
    try {
      const res = await forgotpasswordMutation({
        email,
      }).unwrap();

      toast.add({
        title: "Success",
        description:
          res?.message ||
          "Password reset email sent successfully",
        type: "success",
      });
    } catch (err: any) {
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
        <button onClick={changePasswordHandler} disabled={isLoading} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Change Password
        </button>
    )
    
}

export default ResetPasswordForm;
