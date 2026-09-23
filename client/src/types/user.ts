// client/src/types/user.ts

export interface User {
  _id: string;

  name: string;

  email: string;

  role: "customer" | "admin";

  avator: {
    url: string;
    public_id: string;
  };
}