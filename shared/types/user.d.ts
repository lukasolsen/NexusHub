export interface User {
  id: string;
  userId: string;

  name: string;
  role: "owner" | "mod" | "user"; // "owner", "mod", "user"
}

