import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/features/auth/session";

export function HomePage() {
  const session = useSession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Welcome, {session?.user.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>You are signed in</CardTitle>
          <CardDescription>{session?.user.email}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
