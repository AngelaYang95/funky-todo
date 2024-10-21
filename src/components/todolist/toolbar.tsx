'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect, useState } from "react";
import styles from "./toolbar.module.css";
import {ITool, ToolType} from "../../models";

interface IToolbarProps {
    currentTool: ToolType;
    tools: ITool[];
    setCurrentTool: Function;
}

export default function ToolBar(props: IToolbarProps) {
    function onToolClick(toolType: ToolType) {
        props.setCurrentTool(toolType);
    }

    return (
        <div className={styles.toolbar}>
            <ul>
                {props.tools.map((tool: ITool, i: number) => (
                    <li key={i} onClick={() => onToolClick(tool.type)} className={styles.toolbaritem}
                            data-tool={tool.type}
                            data-is-active={tool.type === props.currentTool}
                            data-tooltip={tool.tooltip}>
                        <DotLottieReact playOnHover
                            className={styles.lottie}
                            src={tool.lottiePath}>
                            </DotLottieReact>
                    </li>
                ))}
            </ul>
        </div>
    );
}