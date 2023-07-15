import React, { useState } from "react";
import style from "./gmaps.module.scss";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ReactLink } from "../ReactLink/ReactLink";
import { IF } from "../../../_helpers";

export const GMaps = ({ ...prop }: {
    pkey: string;
    key: string;
    url: string;
    className?: string;
}) => {
    const [isFinal, onLoading] = useState(false);
    return <div
        className={`${style['gmaps']} ${prop.className ?? ''}`}
    >
        <IF value={isFinal === false}>
            <ReactLink to={prop.url}>
                <FontAwesomeIcon className={style['logo']} icon={faMapMarkedAlt} />
            </ReactLink>
        </IF>
        <iframe hidden={isFinal === false} src={prop.url} style={{ border: 0 }} onLoad={() => onLoading(true)}></iframe>
    </div>
}