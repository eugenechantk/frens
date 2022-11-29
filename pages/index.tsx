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

const Home: NextPage = () => {
  const formRef = useRef<FormHandles>(null);
  const handleFormSubmit: SubmitHandler<FormData> = async (data: any) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().required(),
        name: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const validationErrors: { [key: string]: any } = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path!] = error.message;
        });

        formRef.current!.setErrors(validationErrors);
      }
    }
    console.log(data);
  };

  const [loading, setLoading] = useState(true);
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
        <Stepper>
          <Step complete />
          <Step active />
          <Step />
        </Stepper>

        <Spinner />

        <Form
          ref={formRef}
          onSubmit={handleFormSubmit}
          initialData={{ email: "eugene@uni.minerva.edu", name: "abc" }}
          className=" flex flex-col gap-4 w-full justify-center my-6"
        >
          <InputField
            name="email"
            label="Email"
            placeholder="www.example.com"
            description="Each member will receive club tokens to represent their ownership of the club."
          />
          <InputField
            name="name"
            label="Name"
            placeholder="www.example.com"
            type="text-area"
          />
          <Button type="submit" className=" w-[120px]">
            Submit
          </Button>
        </Form>
        <ImageUpload
          width={64}
          onClick={() => console.log("clicked image component")}
        />
      </main>
    </div>
  );
};

export default Home;
