import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Investment Club</h1>
      <Outlet/>
    </div>
  );
}
