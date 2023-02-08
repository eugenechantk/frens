import { cookies } from "next/headers";
import NotAuthed from "../../components/NotAuthed/NotAuthed";
import AppLayout from "./AppLayout";

async function getAuth() {
  const nextCookies = cookies();
  return nextCookies.get("token")?.value;
}

export default async function ClubLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode,
}) {
  const authToken = await getAuth();
  return (
    <AppLayout>
      {authToken ? <>{children}</> : <NotAuthed/>}
    </AppLayout>
  );
}