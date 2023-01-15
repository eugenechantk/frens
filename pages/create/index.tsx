import React, { ReactElement, useRef, useState } from "react";
import { NextPageWithLayout } from "../_app";
import AppLayout from "../../layout/AppLayout";
import CreateLayout from "../../layout/CreateLayout";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import InputField from "../../components/InputField/InputField";
import { Form } from "@unform/web";
import { Button } from "../../components/Button/Button";
import FeeEstimate from "../../components/FeeEstimate/FeeEstimate";
import axios from "axios";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { FormHandles } from "@unform/core";
import { useAuth } from "../../lib/auth";
import nookies from "nookies";
import { InferGetServerSidePropsType } from "next";
import NotAuthed from "../../components/NotAuthed/NotAuthed";

interface IClubInfoData {
  clubName: string;
  clubDesc: string;
  tokenSym: string;
}

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

const CreateClub: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const formRef = useRef<FormHandles>(null);
  const [clubName, setClubName] = useState("");
  const [clubProfileFile, setClubProfileFile] = useState<any>();
  const [createLoading, setCreateLoading] = useState(false);
  const user = useAuth();

  const handleFormSubmit = async (data: IClubInfoData) => {
    // TODO: implement form handle logic for creating a club

    setCreateLoading(true);

    try {
      const schema = Yup.object().shape({
        clubName: Yup.string().required("Club name is required"),
        tokenSym: Yup.string()
          .max(6, "Token symbol cannot be more than 6 characters")
          .required("Token symbol is required"),
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
      setCreateLoading(false);
      return;
    }

    // Construct a FormData with all club information
    let formData = new FormData();
    formData.append("club_name", data.clubName);
    formData.append("club_description", data.clubDesc);
    formData.append("club_token_sym", data.tokenSym.toUpperCase());
    formData.append("club_image", clubProfileFile);
    formData.append("user_id", user.user?.uid!);

    // console.log(formData);
    // Make a post request to /api/create/club endpoint
    const config = {
      headers: {
        "content-type": "multipart/form-data" 
      },
    };

    try {
      const club_id = await axios
        .post("/api/create/club", formData, config)
        .then((response) => response.data)
        .then((data) => data.club_id);
      await router.push(`/create/${club_id}/1`);
      setCreateLoading(false);
    } catch (err) {
      setCreateLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      {!serverProps.error ? (
        <Form
          ref={formRef}
          onSubmit={handleFormSubmit}
          initialData={{ email: "eugene@uni.minerva.edu", name: "abc" }}
          className=" flex flex-col gap-10 w-full justify-center"
        >
          {/* Club information */}
          <div className="flex flex-col items-start gap-4 w-full">
            <p className="font-bold leading-5 text-sm text-secondary-600 uppercase">
              Club information
            </p>
            <div className="md:flex md:flex-row md:items-start md:gap-8 flex flex-col items-start gap-4 w-full">
              {/* Image upload field */}
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-sm text-gray-800 font-semibold leading-5 md:grow">
                  Profile photo
                </p>
                <ImageUpload
                  setImage={(imageFile: any) => setClubProfileFile(imageFile)}
                />
              </div>
              <div className="md:flex md:flex-col md:items-start md:gap-4 md:shrink md:min-w-0 flex flex-col items-start gap-4 w-full">
                <InputField
                  name="clubName"
                  label="Club name"
                  placeholder="e.g. Friends with profits"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setClubName(e.target.value)
                  }
                />
                <InputField
                  name="clubDesc"
                  type="text-area"
                  label="Club description"
                  placeholder="Something about your investment club"
                />
                <InputField
                  name="tokenSym"
                  label="Club token symbol"
                  description="Each member will receive club tokens to represent their ownership of the club."
                  defaultValue={
                    clubName &&
                    clubName.replace(/\s/g, "").slice(0, 6).toUpperCase()
                  }
                  className="uppercase"
                />
              </div>
            </div>
          </div>
          {/* Creation fee */}
          <div className="flex flex-col items-start">
            <p className="font-bold leading-5 text-sm text-secondary-600 uppercase mb-1">
              Creation fee
            </p>
            <p className=" text-base leading-6 text-gray-800 mb-4">
              The creation fee is to set up the club token and enables the club
              to raise money
            </p>

            <FeeEstimate
              eth={String(process.env.NEXT_PUBLIC_CLUB_DEPOSIT)}
              usd={12.37}
              className="w-full"
            />
          </div>
          {/* Create button */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm leading-5 text-gray-500">
              By clicking “Pay and create” you agree to our Terms of Service
            </p>
            <Button
              type="submit"
              className="w-1/3 min-w-[218px]"
              loading={createLoading}
            >
              <h3>Pay and create</h3>
            </Button>
          </div>
        </Form>
      ) : (
        <NotAuthed />
      )}
    </>
  );
};

CreateClub.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>{page}</CreateLayout>
    </AppLayout>
  );
};

export default CreateClub;
