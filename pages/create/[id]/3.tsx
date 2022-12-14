import React, { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";
import CreateProcessLayout from "../../../layout/CreateProcessLayout";
import Spinner from "../../../components/Spinner/Spinner";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import { useAuth } from "../../../lib/auth";
import nookies from "nookies";
import { InferGetServerSidePropsType } from "next";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";

export const getServerSideProps = async (context: any) => {
  const cookies = nookies.get(context);
  if (!cookies.token) {
    return {
      props: {
        error: "user not authed",
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

const StepThree: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const router = useRouter();
  const { id } = router.query;
  const user = useAuth();

  const handleTokenCreation = async () => {
    await fetch("/api/create/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: String(id),
        userId: String(user.user?.uid),
      }),
    })
      .then(() => {
        setSuccess(true);
        setTimeout(() => router.push(`/create/${id}/complete`), 1500);
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    handleTokenCreation();
  }, []);

  return (
    <>
      {!serverProps.error ? (
        <div className="grow flex flex-col items-center gap-4 w-full">
          <Spinner success={success} error={error} />
          {success ? (
            <>
              <h3 className="text-center">Your club is created!</h3>
              <p className="text-center">
                We will redirect you to your club in a few seconds. Get ready...
              </p>
            </>
          ) : error ? (
            <>
              <h3 className="text-center">Fail to create club</h3>
              <p className="text-center">
                We have received the creation fee but have difficulty creating
                the club. You can try creating your club again.
              </p>
              <Button className="w-[245px]">
                <h3>Create club again</h3>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-center">Creating your club...</h3>
              <p className="text-center">
                This will take a few minutes. Do not close this window
              </p>
            </>
          )}
        </div>
      ) : (
        <NotAuthed />
      )}
    </>
  );
};

StepThree.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        <CreateProcessLayout>{page}</CreateProcessLayout>
      </CreateLayout>
    </AppLayout>
  );
};

export default StepThree;
