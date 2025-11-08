import Link from "next/link";
import CommonLayout from "./components/layouts/CommonLayout";

export default function NotFound() {
  return (
    <CommonLayout>
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>404</h1>
        <p style={{ color: "#666", marginTop: 8 }}>Page not found.</p>
        <Link href="/home" style={{ display: "inline-block", marginTop: 12 }}>
          Go back to Home
        </Link>
      </div>
    </CommonLayout>
  );
}