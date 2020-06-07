import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import './styles.css';

interface Props {
  onFileUpload: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUpload }) => {
  const [fileUrlSelected, setFileUrlSelected] = useState('');
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileUrl = (window.URL ? URL : webkitURL).createObjectURL(file);
      setFileUrlSelected(fileUrl);
      onFileUpload(file);
    },
    [onFileUpload]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />
      {fileUrlSelected ? (
        <img src={fileUrlSelected} alt='thumbnail' />
      ) : (
        <p>
          <FiUpload />
          Arraste de solte o arquivo aqui, ou click para selecionar um aquivo.
        </p>
      )}
    </div>
  );
};

export default Dropzone;
