import { cookies } from "next/headers";
import { createHash } from "crypto";
import LoginForm from "./_components/LoginForm";
import AdminEditor from "./_components/AdminEditor";

function isAuthenticated() {
  const token = cookies().get("admin_token")?.value;
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = password + (process.env.ADMIN_SECRET ?? "molino-secret");
  const valid = createHash("sha256").update(secret).digest("hex");
  return !!password && token === valid;
}

export default function AdminPage() {
  const authed = isAuthenticated();
  return authed ? <AdminEditor /> : <LoginForm />;
}
