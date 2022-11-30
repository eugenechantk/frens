import React, { ReactElement, useRef, useState } from "react";
import { NextPageWithLayout } from "../_app";
import AppLayout from "../../layout/AppLayout";
import CreateLayout from "../../layout/CreateLayout";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import InputField from "../../components/InputField/InputField";
import { Form } from "@unform/web";
import { Button } from "../../components/Button/Button";
import FeeEstimate from "../../components/FeeEstimate/FeeEstimate";

const CreateClub: NextPageWithLayout<any> = () => {
  const formRef = useRef(null);
  const handleFormSubmit = (data: any) => {
    // TODO: implement form handle logic for creating a club
    // TODO: before sending the data, transform the club token field to uppercase
    console.log(data);
  };
  const [clubName, setClubName] = useState("");
  return (
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
          <div className="flex flex-col items-start gap-2 w-[94px] md:min-w-[94px]">
            <p className="text-sm text-gray-800 font-semibold leading-5 md:grow">
              Profile photo
            </p>
            <ImageUpload />
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
              defaultValue={clubName && clubName.slice(0, 6).toUpperCase()}
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
          The creation fee is to set up the club token and enables the club to
          raise money
        </p>

        <FeeEstimate eth={0.0756} usd={12.37} className="w-full"/>
      </div>
      {/* Create button */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm leading-5 text-gray-500">
          By clicking “Pay and create” you agree to our Terms of Service
        </p>
        <Button type="submit" className="w-1/3 min-w-[218px]">
          Pay and create
        </Button>
      </div>
    </Form>
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
