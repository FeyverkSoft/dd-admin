import React, { useState } from "react";
import style from "./instagram.module.scss";
import { InstagramEmbed } from "react-social-media-embed";

export const Instagram = ({ ...prop }: { className: string, url: string, pkey: string }) => {
    const [isFinal, onLoading] = useState(false);
    return <div
        className={`${style['instagram']} ${prop.className ?? ''}`}
    >
        <div
            style={{
                display: 'block',
                justifyContent: 'center',
                position: 'relative',
                overflow: "hidden",
                maxWidth: '400px'
            }}
        >
           {<InstagramEmbed
                key={prop.pkey}
                url={prop.url}
                
                captioned
                width={328}
        />}
        </div>
    </div>
}