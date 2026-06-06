// src/components/RichTextEditorFull.jsx
import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './RichTextEditor.css';
import './QuillFonts.css';

// Configurar fuentes personalizadas
const FontAttributor = Quill.import('attributors/style/font');
FontAttributor.whitelist = [
    'arial', 'times-new-roman', 'courier-new', 'georgia', 'verdana',
    'helvetica', 'trebuchet', 'roboto', 'open-sans', 'lato',
    'montserrat', 'poppins', 'inter', 'raleway', 'ubuntu',
    'nunito', 'playfair-display', 'merriweather'
];
Quill.register(FontAttributor, true);

// Configurar tamaños personalizados
const SizeAttributor = Quill.import('attributors/style/size');
const sizeArr = [];
for (let i = 6; i <= 200; i++) {
    sizeArr.push(i + 'px');
}
SizeAttributor.whitelist = sizeArr;
Quill.register(SizeAttributor, true);

// Custom Image Blot para manejar clases de alineación
const Image = Quill.import('formats/image');

class CustomImage extends Image {
    static create(value) {
        const node = super.create(value);
        return node;
    }

    static formats(domNode) {
        const formats = super.formats(domNode);
        if (domNode.className) {
            formats.class = domNode.className;
        }
        return formats;
    }

    format(name, value) {
        if (name === 'class') {
            if (value) {
                this.domNode.className = value;
            } else {
                this.domNode.removeAttribute('class');
            }
        } else {
            super.format(name, value);
        }
    }
}
CustomImage.blotName = 'image';
CustomImage.tagName = 'IMG';
Quill.register(CustomImage, true);

export default function RichTextEditorFull({
    value,
    onChange,
    placeholder = "Escribe aquí...",
    readOnly = false,
    toolbar = 'full',
    externalRef
}) {
    const internalRef = useRef(null);
    const quillRef = externalRef || internalRef;
    const [editorReady, setEditorReady] = useState(false);
    const editorInitialized = useRef(false);
    const initialValueSet = useRef(false);
    const lastKnownValue = useRef(value);

    // Actualizar referencia del último valor conocido
    useEffect(() => {
        if (value && value !== '<p><br></p>') {
            lastKnownValue.current = value;
        }
    }, [value]);

    // Handler seguro para onChange que previene pérdida de datos
    const handleChange = useCallback((content, delta, source, editor) => {
        // Ignorar cambios durante la inicialización
        if (!editorReady) return;
        
        // Solo procesar cambios del usuario
        if (source === 'user') {
            lastKnownValue.current = content;
            onChange?.(content);
        } else if (source === 'api' && initialValueSet.current) {
            // Permitir cambios de API solo después de que se estableció el valor inicial
            onChange?.(content);
        }
    }, [onChange, editorReady]);

    // Helper seguro para obtener editor
    const getEditor = useCallback(() => {
        try {
            if (!editorReady || !quillRef.current) return null;
            const editor = quillRef.current.getEditor?.();
            return editor || null;
        } catch {
            return null;
        }
    }, [quillRef, editorReady]);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('Por favor selecciona un archivo de imagen válido');
                    document.body.removeChild(input);
                    return;
                }

                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('La imagen es demasiado grande. El tamaño máximo es 5MB');
                    document.body.removeChild(input);
                    return;
                }

                try {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const base64 = e.target.result;
                        const quill = getEditor();
                        if (quill) {
                            const range = quill.getSelection(true) || { index: quill.getLength() };
                            quill.insertEmbed(range.index, 'image', base64);
                            quill.setSelection(range.index + 1);
                        }
                        document.body.removeChild(input);
                    };
                    reader.onerror = () => {
                        alert('Error al leer el archivo');
                        document.body.removeChild(input);
                    };
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('Error al procesar la imagen:', error);
                    document.body.removeChild(input);
                }
            } else {
                document.body.removeChild(input);
            }
        };

        input.oncancel = () => {
            document.body.removeChild(input);
        };

        input.click();
    }, [getEditor]);

    const toolbarConfig = useMemo(() => {
        if (toolbar === 'minimal') {
            return [['bold', 'italic', 'underline', { 'color': [] }, { 'align': [] }]];
        }
        if (toolbar === 'basic') {
            return [[
                'bold', 'italic', 'underline',
                { 'color': [] }, { 'background': [] }, { 'align': [] },
                { 'list': 'ordered' }, { 'list': 'bullet' }, 'link', 'image'
            ]];
        }
        return [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': FontAttributor.whitelist }],
            [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ];
    }, [toolbar]);

    const modules = useMemo(() => ({
        toolbar: { 
            container: toolbarConfig, 
            handlers: { image: imageHandler } 
        },
        clipboard: { matchVisual: false },
        history: { delay: 1000, maxStack: 100, userOnly: true }
    }), [toolbarConfig, imageHandler]);

    const formats = [
        'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'indent', 'align', 
        'link', 'image'
    ];

    // Marcar editor como listo y establecer valor inicial
    useEffect(() => {
        if (editorInitialized.current) return;
        
        const timer = setTimeout(() => {
            if (quillRef.current) {
                try {
                    const editor = quillRef.current.getEditor?.();
                    if (editor) {
                        setEditorReady(true);
                        editorInitialized.current = true;
                        initialValueSet.current = true;
                    }
                } catch {
                    // Reintentar
                    setTimeout(() => {
                        if (quillRef.current) {
                            setEditorReady(true);
                            editorInitialized.current = true;
                            initialValueSet.current = true;
                        }
                    }, 200);
                }
            }
        }, 150);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="rich-text-editor-wrapper">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                readOnly={readOnly}
            />
        </div>
    );
}
