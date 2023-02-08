import AppLayout from "../../layout/AppLayout";

export default function ClubLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode,
}) {
  return (
    <AppLayout>{children}</AppLayout>
  );
}