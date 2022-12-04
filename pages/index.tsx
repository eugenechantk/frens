import type { NextPage } from "next";
import Head from "next/head";
import InputField from "../components/InputField/InputField";
import { Button } from "../components/Button/Button";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { useRef, useState } from "react";
import * as Yup from "yup";
import ImageUpload from "../components/ImageUpload/ImageUpload";
import Step from "../components/Stepper/Step";
import Stepper from "../components/Stepper/Stepper";
import Spinner from "../components/Spinner/Spinner";
import { initWallet } from "../lib/ethereum";
import { doc, getDoc } from "firebase/firestore";
import { clientFireStore } from "../firebase/firebaseClient";

const Home: NextPage = () => {
  const getWalletBackend = (clubId: string) => {
    fetch("/api/create/wallet", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ clubId: clubId }),
    }).then((response) => console.log(response));
  };

  const fetchClubWallet = async (clubId: string) => {
    const docSnap = await getDoc(doc(clientFireStore, 'clubs', clubId));
    console.log(docSnap);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>frens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col justify-center px-20">
        <h1 className="text-6xl font-bold text-primary-600 mb-8">
          Welcome to frens
        </h1>
        <Button onClick={() => getWalletBackend("fQ26ccd2ptW3924T0qcy")}>
          <h3>Initialize wallet</h3>
        </Button>
        <Button onClick={() => fetchClubWallet("fQ26ccd2ptW3924T0qcy")}>
          <h3>Fetch wallet on FE</h3>
        </Button>
      </main>
    </div>
  );
};

export default Home;
