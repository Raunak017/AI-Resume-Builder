export type ExpiryOption = "session" | "week" | "permanent";

interface Props {
  expiry: ExpiryOption;
  setExpiry: (val: "session" | "week" | "permanent") => void;
}

export default function Step1_Expiry({ expiry, setExpiry }: Props) {
  const options: { label: string; value: "session" | "week" | "permanent" }[] =
    [
      { label: "Session Only", value: "session" },
      { label: "Keep for 1 Week", value: "week" },
      { label: "Permanent", value: "permanent" },
    ];

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">1. Data Expiry</h2>
      <div className="flex gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setExpiry(opt.value)}
            className={`px-4 py-2 rounded ${
              expiry === opt.value ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
