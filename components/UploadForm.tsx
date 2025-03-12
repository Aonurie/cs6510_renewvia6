import { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [polesCost, setPolesCost] = useState('');
  const [mvCablesCost, setMvCablesCost] = useState('');
  const [lvCablesCost, setLvCablesCost] = useState('');
  const [transformersCost, setTransformersCost] = useState('');
  const [dropCablesCost, setDropCablesCost] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Please select an Excel file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('polesCost', polesCost);
    formData.append('mvCablesCost', mvCablesCost);
    formData.append('lvCablesCost', lvCablesCost);
    formData.append('transformersCost', transformersCost);
    formData.append('dropCablesCost', dropCablesCost);

    //test
    console.log('File:', file);
    console.log('Poles Cost:', polesCost);
    console.log('MV Cables Cost:', mvCablesCost);
    console.log('LV Cables Cost:', lvCablesCost);
    console.log('Transformers Cost:', transformersCost);
    console.log('Drop Cables Cost:', dropCablesCost);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setMessage('Form data logged to console.');
  };

  return (
    <div>
      <h2>Upload Excel File and Costs</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <div>
        <label>
          Poles Cost: 
          <input type="text" value={polesCost} onChange={(e) => setPolesCost(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          MV Cables Cost: 
          <input type="text" value={mvCablesCost} onChange={(e) => setMvCablesCost(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          LV Cables Cost: 
          <input type="text" value={lvCablesCost} onChange={(e) => setLvCablesCost(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Transformers Cost: 
          <input type="text" value={transformersCost} onChange={(e) => setTransformersCost(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Drop Cables Cost: 
          <input type="text" value={dropCablesCost} onChange={(e) => setDropCablesCost(e.target.value)} />
        </label>
      </div>
      <button onClick={handleUpload}>Upload Excel</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;
