import Image from "next/image";
import React from "react";
import completeImage from "../../public/steps/step_completed.png";
import defaultImage from "../../public/steps/step_default.png";
import currentImage from "../../public/steps/step_current.png";

interface IStepProps {
  active?: boolean;
  complete?: boolean;
  last?: boolean;
}

export default function Step({
  active = false,
  complete,
  last = false,
}: IStepProps) {
  return (
    <>
      {active ? (
        <Image src={currentImage} alt="current step" />
      ) : complete ? (
        <Image src={completeImage} alt="complete step" />
      ) : (
        <Image src={defaultImage} alt="step" />
      )}
    </>
  );
}
