'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./todolistitem.module.css";
import React, { useRef, useCallback, useState } from 'react';
import { ToolType, ITodoListItem } from "@/models";
import { CSSProperties } from "react";

interface ITodoListItemProps {
    currentTool: ToolType;
    todoListItem: ITodoListItem;
    toggleItemIsComplete: () => void;
    deleteItem: () => void;
}

export default function TodoListItem(props: ITodoListItemProps) {

    const checkboxRef = useRef<HTMLDivElement|null>(null);
    const eraseButtonRef = useRef<HTMLDivElement|null>(null);
    const textRef = useRef<HTMLDivElement|null>(null);
    const todoItemRef = useRef<HTMLLIElement|null>(null);
    
    const tlRef = useRef<gsap.core.Timeline|null>(null);
    const [isAnimatingErase, setIsAnimatingErase] = useState<boolean>(false);

    /** 
     * Calculates the scale to increase the erase trail element by.
     * from(0.5px) -> to(2px) = scale(4)
     */
    function calcEraseButtonScalePercentage(): number {
        const fromDiameter = eraseButtonRef!.current!.getBoundingClientRect().width;
        const toDiameter = todoItemRef!.current!.getBoundingClientRect().width;
        return toDiameter / fromDiameter;
    }

    useGSAP(() => {
        // Setup erase animation.
        if (props.currentTool !== ToolType.ERASER || !eraseButtonRef?.current || !todoItemRef?.current) {
            return;
        }

        const eraseTl = gsap.timeline({paused: true});
        eraseTl.to(eraseButtonRef!.current, {scale: calcEraseButtonScalePercentage(), duration: 1});
        eraseTl.to(todoItemRef!.current, {height: 0, margin: 0, padding: 0, duration: 0.3, onComplete: () => {
            setIsAnimatingErase(false);
            props.deleteItem();
        }}, "+=0");
        tlRef.current = eraseTl;
    }, {dependencies: [props.todoListItem, props.currentTool], revertOnUpdate: true});

    const handleMouseUp = useCallback(() => {
        switch(props.currentTool) {
            case ToolType.POINTER:
                props.toggleItemIsComplete();
                break;
            case ToolType.ERASER:
                handleErase();
                break;
            default:
                console.error("Invalid tool type:", props.currentTool);
        }
    }, [props.currentTool]);

    const getHighlightColor = useCallback(() => {
        switch(props.currentTool) {
            case ToolType.POINTER:
                return {
                    "--highlight-background": "var(--primary-purple)",
                    "--highlight-foreground": "black",
                } as CSSProperties;
            case ToolType.ERASER:
                return {
                    "--highlight-background": "var(--primary-yellow)",
                    "--highlight-foreground": "black",
                } as CSSProperties;
            default:
                return {
                    "--highlight-background": "black",
                    "--highlight-foreground": "white",
                } as CSSProperties;
        }
    }, [props.currentTool]);

    const handleErase = useCallback(() => {
        setIsAnimatingErase(true);
        if (tlRef?.current) {
            tlRef!.current!.play();
        }
    }, [tlRef]);

    return (
        <li ref={todoItemRef} className={`${styles.todoListItem} ${isAnimatingErase ? styles.isAnimatingErase : ""}`} 
                style={getHighlightColor()}
                onClick={handleMouseUp}
                data-is-complete={props.todoListItem.isComplete}
                data-mode={props.currentTool}
                >
            {
                props.currentTool === ToolType.ERASER ? 
                (<span ref={eraseButtonRef} className={styles.eraserTrail}></span>) : (<></>)
            }
            <div ref={checkboxRef} className={styles.checkbox} data-checked={props.todoListItem.isComplete + ""}>
                <svg className={styles.checkboxcheck} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.875 14.5195L9.77344 19.1953L19.125 4.5" stroke="black" stroke-width="6" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div ref={textRef} className={styles.todoListItemText}>{props.todoListItem.desc}</div>
        </li>
    );
}