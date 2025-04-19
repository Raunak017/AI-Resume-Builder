interface Props {
  importMethod: string;
  setImportMethod: (val: string) => void;
}

const options = [
  "PDF File",
  "Direct Text Input",
  "LinkedIn Profile",
  "Google Doc",
];

export default function Step3_ImportMethod({
  importMethod,
  setImportMethod,
}: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">3. Choose Import Method</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((method) => (
          <button
            key={method}
            onClick={() => setImportMethod(method)}
            className={`border rounded p-3 text-left ${
              importMethod === method ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {method}
          </button>
        ))}
      </div>
    </section>
  );
}
