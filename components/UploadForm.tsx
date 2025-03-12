import React, { useState } from 'react';

const UploadForm: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [inputs, setInputs] = useState({
    polesCost: '',
    mvCablesCost: '',
    lvCablesCost: '',
    transformersCost: '',
    dropCablesCost: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (excelFile) {
      formData.append('file', excelFile);
    }
    // Append additional text inputs
    Object.keys(inputs).forEach((key) => {
      formData.append(key, inputs[key as keyof typeof inputs]);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="excelUpload">Excel File:</label>
        <input
          id="excelUpload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
      </div>

      <div>
        <label htmlFor="polesCost">Poles Cost:</label>
        <input
          id="polesCost"
          type="text"
          name="polesCost"
          value={inputs.polesCost}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="mvCablesCost">MV Cables Cost:</label>
        <input
          id="mvCablesCost"
          type="text"
          name="mvCablesCost"
          value={inputs.mvCablesCost}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="lvCablesCost">LV Cables Cost:</label>
        <input
          id="lvCablesCost"
          type="text"
          name="lvCablesCost"
          value={inputs.lvCablesCost}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="transformersCost">Transformers Cost:</label>
        <input
          id="transformersCost"
          type="text"
          name="transformersCost"
          value={inputs.transformersCost}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="dropCablesCost">Drop Cables Cost:</label>
        <input
          id="dropCablesCost"
          type="text"
          name="dropCablesCost"
          value={inputs.dropCablesCost}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UploadForm;
