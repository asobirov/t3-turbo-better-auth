import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, getSession } from "@acme/auth";
import { Button } from "@acme/ui/button";

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            const { url } = await auth.api.signInSocial({
              body: {
                provider: "discord",
                callbackURL: "/",
              },
            });

            if (url) {
              redirect(url);
            }
          }}
        >
          Sign in with Discord
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
