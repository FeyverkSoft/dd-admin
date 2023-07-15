import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from 'react';
import { useState } from "react";
import { Select, Button, Tooltip } from "antd"
import { SaveFilled, CloseOutlined } from '@ant-design/icons';
import { IF } from '../../_helpers';
import i18n from '../../core/Lang';
import MarkdownContent from "../Shared/Md/MarkdownContent";

export interface EditorProps {
    value: string;
}

export const Editor = ({ ...props }: EditorProps) => {
    const [edited, toggleEdited] = useState(false);
    const [value, changeValue] = useState(props.value);

    useEffect(() => {
        changeValue(props.value);
    }, [props.value]);

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
            onChange={(e) => changeValue(e.target.value)}></TextArea>
        <div
            style={{
                display: 'flex',
                flex: '1 1 50%'
            }}>
            <MarkdownContent
                value={value}/>
        </div>
    </div>
}