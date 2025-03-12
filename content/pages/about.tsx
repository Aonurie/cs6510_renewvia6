import dynamic from "next/dynamic";

const Input = dynamic(() => import(".../../components/input"), { ssr: false });

const AboutPage = () => {
  return (
    <div>
      <h1>Power Grid Generation Project</h1>
      <p>Use the form below to upload an Excel file and provide cost inputs:</p>
      <Input />
    </div>
  );
};
