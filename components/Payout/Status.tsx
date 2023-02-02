import Image from "next/image";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import PendingIcon from "../../public/status/status_pending.png"
import ErrorIcon from "../../public/status/status_error.png"
import SuccessIcon from "../../public/status/status_success.png"

export default function Status({
  status,
  error,
}: {
  status?: "pending" | "done" | "in-progress";
  error?: any;
}) {
  return (
    <div className="bg-secondary-100 h-6">
      {error ? (
        <Image src={ErrorIcon} alt="error" height={24} width={24} />
      ) : status === "done" ? (
        <Image src={SuccessIcon} alt="done" height={24} width={24} />
      ) : status === "pending" ? (
        <Image src={PendingIcon} alt="pending" height={24} width={24} />
      ) : (
        <ClipLoader loading size={24} color="#2172E5" />
      )}
    </div>
  );
}
