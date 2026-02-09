import { Suspense } from "react";

import { PageBackground } from "@/components/ui/layouts";

import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <PageBackground>
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </PageBackground>
  );
}
