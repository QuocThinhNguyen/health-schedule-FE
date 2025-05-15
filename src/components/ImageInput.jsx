import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

function ImageInput({ value, onChange, className = '', placeholder = 'Browse Image to upload!' }) {
    
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!value) {
            setPreviewImage(null);
            return;
        }
        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreviewImage(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else if (typeof value === 'string') {
            if (value.startsWith('http')) {
                setPreviewImage(value);
            } else {
                setPreviewImage(value);
            }
        }
    }, [value]);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setPreviewImage(URL.createObjectURL(selected));
            onChange && onChange(selected);
        }
    };
    return (
        <div
            onClick={handleDivClick}
            className={`relative flex items-center justify-center rounded border-2 border-dashed border-[rgb(var(--bg-active-rgb))] ${className}`}
        >
            {previewImage ? (
                <img
                    src={previewImage}
                    alt="Selected"
                    className="w-full h-full object-contain bg-[var(--bg-secondary)]"
                />
            ) : (
                <div className="w-full h-full flex flex-col justify-center items-center text-[rgb(var(--bg-active-rgb))]">
                    <AiOutlineCloudUpload size={72} />
                    <p>{placeholder}</p>
                </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
    );
}

export default ImageInput;
