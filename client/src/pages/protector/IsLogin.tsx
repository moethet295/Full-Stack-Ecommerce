import type { RootState } from "@/store";
import { useCurrentUserQuery } from "@/store/slices/userApi";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IsLoginProps {
  children: ReactNode;
}

function IsLogin({ children }: IsLoginProps) {
  const navigate = useNavigate();

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  );

  const { isError } = useCurrentUserQuery();

  useEffect(() => {
    if (!userInfo || isError) {
      navigate("/login", { replace: true });
    }
  }, [userInfo, isError, navigate]);

  if (!userInfo || isError) {
    return null;
  }

  return <>{children}</>;
}

export default IsLogin;