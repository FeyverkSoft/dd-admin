import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from 'react';
import { useState } from "react";
import MarkdownContent from "../Shared/Md/MarkdownContent";

export interface EditorProps {
    value?: string;
    onChange?: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value = '', onChange }) => {
    const [edited, toggleEdited] = useState(false);
    const [text, changeText] = useState(undefined);

    return <div style={{
        display: 'flex',
        flex: '1 1 100%'
    }}>
        <TextArea
            style={{
                display: 'flex',
                flex: '1 1 50%'
            }}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                return changeText(e.target.value);
            }}></TextArea>
        <div
            style={{
                display: 'flex',
                flex: '1 1 50%'
            }}>
            <MarkdownContent
                value={value} />
        </div>
    </div>
}