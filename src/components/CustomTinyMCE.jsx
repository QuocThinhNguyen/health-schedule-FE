import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const CustomTinyMCE = ({ name, value, onChange, onBlur }) => {
    const editorRef = useRef(null);
    return (
        <Editor
            value={value} // Đồng bộ giá trị từ state
            apiKey={import.meta.env.VITE_API_KEY_TINYMCE}
            init={{
                height: 800,
                // menubar: true,
                // plugins: [
                //     //   "advlist autolink lists link image charmap preview anchor",
                //     //   "searchreplace visualblocks code fullscreen",
                //     //   "insertdatetime media table paste code help wordcount"

                // ],
                // toolbar:
                //     //   "undo redo | formatselect | bold italic backcolor | \
                //     //   alignleft aligncenter alignright alignjustify | \
                //     //   bullist numlist outdent indent | removeformat | help"

                plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                menu: {
                    favs: { title: 'menu', items: 'searchreplace' },
                },
                menubar: 'favs file edit view insert format tools table',
                content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:16px}',
            }}
            onInit={(editor) => (editorRef.current = editor)}
            onEditorChange={(value) => onChange({ target: { name, value: value } })}
            onBlur={(event) => onBlur({ target: { name, value: event.target.getContent() } })}
        />
    );
};
export default CustomTinyMCE;
