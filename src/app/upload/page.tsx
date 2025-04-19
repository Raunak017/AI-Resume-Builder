"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1_Expiry from "./components/Step1_Expiry";
import Step2_Sharing from "./components/Step2_Sharing";
import Step3_ImportMethod from "./components/Step3_ImportMethod";

export type ExpiryOption = "session" | "week" | "permanent";

export default function UploadPage() {
  const [expiry, setExpiry] = useState<ExpiryOption>("session");
  const [sharedUsers, setSharedUsers] = useState<string[]>(["me"]);
  const [importMethod, setImportMethod] = useState<string>("");

  const router = useRouter();

  const handleContinue = async () => {
    if (!importMethod) {
      alert("Please select an import method.");
      return;
    }

    const payload = {
      expiry,
      sharedUsers,
      importMethod,
    };

    const res = await fetch("/api/temp-store", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      switch (importMethod) {
        case "PDF File":
          router.push("/workflows/pdf");
          break;
        case "LinkedIn Profile":
          router.push("/workflows/linkedin");
          break;
        case "Direct Text Input":
          router.push("/workflows/text");
          break;
        case "Google Doc":
          router.push("/workflows/google");
          break;
        default:
          alert("Unsupported import method.");
      }
      // Add other routes later for "Direct Text", "LinkedIn", etc.
    } else {
      alert("Something went wrong saving your choices.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upload Resume Data</h1>

      <Step1_Expiry expiry={expiry} setExpiry={setExpiry} />
      <Step2_Sharing
        sharedUsers={sharedUsers}
        setSharedUsers={setSharedUsers}
      />
      <Step3_ImportMethod
        importMethod={importMethod}
        setImportMethod={setImportMethod}
      />

      <button
        onClick={handleContinue}
        className="bg-green-600 text-white px-6 py-2 rounded mt-6"
      >
        Continue
      </button>
    </main>
  );
}
