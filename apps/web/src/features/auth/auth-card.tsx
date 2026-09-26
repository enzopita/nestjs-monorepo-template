import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  footer: {
    text: string;
    label: string;
    to: "/sign-in" | "/sign-up";
    redirect: string | undefined;
  };
  children: ReactNode;
};

// Card shell shared by the sign-in and sign-up pages; the footer links to the other page.
export function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {footer.text}&nbsp;
        <Link
          to={footer.to}
          search={{ redirect: footer.redirect }}
          className="text-foreground underline underline-offset-4"
        >
          {footer.label}
        </Link>
      </CardFooter>
    </Card>
  );
}
