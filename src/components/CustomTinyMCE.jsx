import React, { useContext, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ThemeContext } from '~/context/ThemeProvider';

const CustomTinyMCE = ({ name, value, onChange, onBlur = null , height=800}) => {
    const { isDark } = useContext(ThemeContext);
    const editorRef = useRef(null);
    useEffect(() => {}, [isDark]);
    const handleBlur = (event) => {
        if (onBlur) {
            onBlur({ target: { name, value: event.target.getContent() } });
        }
    };
    return (
        <>
            <Editor
                value={value} // Đồng bộ giá trị từ state
                apiKey={import.meta.env.VITE_API_KEY_TINYMCE}
                init={{
                    height: height,
                    plugins:
                        'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar:
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    menu: {
                        favs: { title: 'menu', items: 'searchreplace' },
                    },
                    menubar: 'favs file edit view insert format tools table',
                    content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:13px}',
                }}
                onInit={(editor) => (editorRef.current = editor)}
                onEditorChange={(value) => onChange(value)}
                onBlur={handleBlur}
            />
        </>
    );
};
export default CustomTinyMCE;
