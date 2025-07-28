import { useSearchParams } from "react-router-dom";

export default function ResendVerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get("email");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>This link has expired.</h1>
      <p>Email from query: <strong>{email}</strong></p>
    </div>
  );
}
