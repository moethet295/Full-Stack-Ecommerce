import type { RootState } from "@/store";
import type { ReactNode } from "react";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IsAdminProps {
  children: ReactNode;
}

function IsAdmin({ children }: IsAdminProps) {
  const navigate = useNavigate();

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true });
      return;
    }

    if (userInfo.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [userInfo, navigate]);

  if (!userInfo || userInfo.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}

export default IsAdmin;