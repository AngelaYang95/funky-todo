'use client';

import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';
import React, { useRef } from "react";
import styles from "./toolbar.module.css";
import {ITool, ToolType} from "../../models";

interface IToolbarItemProps {
    currentTool: ToolType;
    tool: ITool;
    setCurrentTool: Function;
}

function ToolbarItem(props: IToolbarItemProps) {
    let lottiePlayer = useRef<DotLottie>(null);
    
    function onToolClick(toolType: ToolType) {
        props.setCurrentTool(toolType);
    }
    
    function lottieRefCallback(lottie: DotLottie) {
        lottiePlayer = {current: lottie};
    }
    
    function onMouseEnter() {
        if (lottiePlayer?.current) {
            lottiePlayer!.current!.play();
        }
    }

    return (
        <li onClick={() => onToolClick(props.tool.type)} className={styles.toolbaritem}
                onMouseOver={onMouseEnter}
                data-tool={props.tool.type}
                data-is-active={props.tool.type === props.currentTool}
                data-tooltip={props.tool.tooltip}>
            <DotLottieReact 
                dotLottieRefCallback={lottieRefCallback}
                className={styles.lottie}
                src={props.tool.lottiePath}>
                </DotLottieReact>
        </li>
    );
}

interface IToolbarProps {
    currentTool: ToolType;
    tools: ITool[];
    setCurrentTool: Function;
}

export default function ToolBar(props: IToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <ul>
                {props.tools.map((tool: ITool, i: number) => (
                    <ToolbarItem key={i}
                        currentTool={props.currentTool} 
                        tool={tool}
                        setCurrentTool={props.setCurrentTool}></ToolbarItem>
                ))}
            </ul>
        </div>
    );
}