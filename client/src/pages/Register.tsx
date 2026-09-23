import { registerSchema } from "../Schema/Auth";
import { z } from "zod";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "@/store/slices/userApi";
import { toast } from "@/components/ui/toast"
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect } from "react";

type FormInputs = z.infer<typeof registerSchema>;

function Register() {
  const [registerMutation, { isLoading, isError, error }] =
    useRegisterMutation();
  const userInfo = useSelector((state: RootState)=> state.auth.userInfo)

  const navigate = useNavigate();

  const form = useForm<FormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const submit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await registerMutation(data).unwrap();

      toast.add({
        title: "Registration Successful",
        description: "You have successfully registered. Please log in.",
      });
      form.reset();
      
      navigate("/login");
    } catch (err:any) {
       toast.add({
            type: "error",
            description: "register is not successful.",
            priority: "high",
          })
        
      console.error("Register failed:", err);
      
    }
  };

  useEffect(()=> {
    if(userInfo){
      navigate("/");
    }
  },[navigate,userInfo]);

  return (
    <section className="flex h-[72vh] w-full items-center justify-center mt-20">
      <div className="w-1/3 max-w-md rounded-xl border border-gray-400 p-10">
        <form
          onSubmit={handleSubmit(submit)}
          className="mt-4 space-y-4"
        >
          <h2 className="mb-6 text-center text-2xl font-bold">
            FASHION KING
          </h2>

          <h2 className="mb-6 text-center text-sm font-medium text-gray-200">
            Welcome From The Store
          </h2>

          {/* Name */}
          <div>
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className="w-full rounded-xl border-2 px-2 py-2 text-sm font-medium text-gray-400"
              />

              {errors.name && (
                <span className="mt-1 block text-sm font-medium text-red-500">
                  {errors.name.message}
                </span>
              )}
          </div>


          {/* Email */}
          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full rounded-xl border-2 px-2 py-2 text-sm font-medium text-gray-400"
            />

            {errors.email && (
              <span className="mt-1 block text-sm font-medium text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full rounded-xl border-2 px-2 py-2 text-sm font-medium text-gray-400"
            />

            {errors.password && (
              <span className="mt-1 block text-sm font-medium text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* API Error */}
          {isError && (
            <p className="text-center text-sm font-medium text-red-500">
              Registration failed. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full rounded-xl bg-black p-3 text-center text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading || isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="my-6 text-center text-sm font-medium">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
