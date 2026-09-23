import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

import { useLoginMutation } from "@/store/slices/userApi";
import { setUserInfo } from "@/store/slices/auth";

import { toast } from "@/components/ui/toast";

import type { RootState } from "@/store";

const spacingOptions = [
  {
    className: "[--card-spacing:--spacing(3)]",
    label: "12px",
    value: "3",
  },
  {
    className: "[--card-spacing:--spacing(4)]",
    label: "16px",
    value: "4",
  },
  {
    className: "[--card-spacing:--spacing(5)]",
    label: "20px",
    value: "5",
  },
  {
    className: "[--card-spacing:--spacing(6)]",
    label: "24px",
    value: "6",
  },
];

export function Login() {
  const [loginMutation, { isLoading }] =
    useLoginMutation();

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [spacing, setSpacing] = React.useState("3");

  const selectedSpacing = spacingOptions.find(
    (option) => option.value === spacing
  );

  const submit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const result = await loginMutation({
        email,
        password,
      }).unwrap();

      console.log("LOGIN RESULT =", result);

      dispatch(setUserInfo(result));

      toast.add({
        title: "Login Successful",
        description:
          "You have successfully logged in.",
      });

      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err);

      toast.add({
        type: "error",
        title: "Login Failed",
        description:
          err?.data?.message ||
          "Email or password is incorrect.",
        priority: "high",
      });
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div className="mx-auto grid w-full max-w-sm gap-3">

      {/* Card Spacing */}
      <ToggleGroup
        value={[spacing]}
        onValueChange={(value) => {
          if (value[0]) {
            setSpacing(value[0]);
          }
        }}
        variant="outline"
        size="sm"
        className="justify-center"
      >
        {spacingOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Login Card */}
      <Card className={selectedSpacing?.className}>

        {/* Header */}
        <CardHeader className="pb-3">

          <CardTitle>
            Login to your account
          </CardTitle>

          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>

          <CardAction>
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </CardAction>

        </CardHeader>

        {/* Content */}
        <CardContent>

          <form onSubmit={submit}>

            <div className="flex flex-col gap-4">

              {/* Email */}
              <div className="grid gap-1.5">

                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              {/* Password */}
              <div className="grid gap-1.5">

                <div className="flex items-center justify-between">

                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>

                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-2">

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? "Logging in..."
                  : "Login"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                Login with Google
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}

