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

const Home: NextPage = () => {
  const getWalletBackend = () => {
    fetch("/api/create/wallet", { method: "GET" }).then((response) =>
      console.log(response)
    );
  };

  const getWalletFE = () => {
    const mnemonic =
      "camp viable army easy document betray lens empower report leaf twenty achieve";
    const wallet = initWallet(mnemonic);
    console.log(wallet);
  };

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
        <Button onClick={getWalletBackend}>
          <h3>Initialize wallet</h3>
        </Button>
      </main>
    </div>
  );
};

export default Home;
