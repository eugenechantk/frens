import { Button } from "../../components/Button/Button";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <p className="mb-3">Club List</p>
      <Link href="/clubs/oyWDH6FZndlWmxQtOkeH">
        <Button>
          <h3>Go to club</h3>
        </Button>
      </Link>
    </>
  );
}
