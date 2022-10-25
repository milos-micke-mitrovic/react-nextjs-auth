import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

import AuthForm from "../components/auth/auth-form";

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // we coud also do getServerSideProps like on /porfile page
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <AuthForm />;
}

export default AuthPage;
