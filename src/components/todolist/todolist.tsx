'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./todolist.module.css";
import React, { useRef, useState, useEffect } from 'react';
import { ToolType } from "@/models";
import { CSSProperties } from "react";

const noteName: string = "TODAY'S TASKS";
const inputPlaceholder: string = "What's next?";

/** Interface for representing a todo item. */
interface ITodoListItem {
    desc: string;
    isComplete?: boolean;
}

interface TodoListItemProps {
    currentTool: ToolType;
    todoListItem: ITodoListItem;
    toggleItemIsComplete: () => void;
    deleteItem: () => void;
}

function TodoListItem(props: TodoListItemProps) {
    const checkboxRef = useRef<HTMLDivElement|null>(null);
    const eraseButtonRef = useRef<HTMLDivElement|null>(null);
    const textRef = useRef<HTMLDivElement|null>(null);
    const todoItemRef = useRef<HTMLLIElement|null>(null);
    const runningAnimRef = useRef<boolean>(false);
    
    // const [tl, setTl] = useState<gsap.core.Timeline|null>(null);
    const tlRef = useRef<gsap.core.Timeline|null>(null);

    /** 
     * Calculates the scale to increase the erase trail element by.
     * from(0.5px) -> to(2px) = scale(4)
     */
    function calcEraseButtonScalePercentage(): number {
        const fromDiameter = eraseButtonRef!.current!.getBoundingClientRect().width;
        const toDiameter = todoItemRef!.current!.getBoundingClientRect().width;
        return toDiameter / fromDiameter * 2;
    }

    useGSAP(() => {
        // Setup erase animation.
        if (props.currentTool !== ToolType.ERASER || !eraseButtonRef?.current || !todoItemRef?.current) {
            return;
        }

        const eraseTl = gsap.timeline({paused: true});
        eraseTl.to(eraseButtonRef!.current, {scale: calcEraseButtonScalePercentage(), duration: 0.75});
        eraseTl.to(todoItemRef!.current, {height: 0, margin: 0, padding: 0, duration: 0.3, onComplete: () => {
            props.deleteItem();
            runningAnimRef.current = false;
        }}, "+=0");
        // setTl(eraseTl);
        tlRef.current = eraseTl;
    }, {dependencies: [props.todoListItem, props.currentTool], revertOnUpdate: true});

    function handleMouseUp() {
        switch(props.currentTool) {
            case ToolType.POINTER:
                props.toggleItemIsComplete();
                break;
            case ToolType.ERASER:
                break;
            default:
                console.error("Invalid tool type:", props.currentTool);
        }
    }

    function getTooltipText() {
        const completeTooltip = "Nevermind";
        const todoTooltip = "Mark complete";
        const deleteTooltip = "Erase task";

        switch(props.currentTool) {
            case ToolType.POINTER:
                return props.todoListItem.isComplete ? completeTooltip : todoTooltip;
            case ToolType.ERASER:
                return deleteTooltip;
            default:
                console.error("Invalid tool type:", props.currentTool);
        }
    }

    function getHighlightColor() {
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
    }

    function handleErase() {
        if (tlRef?.current && !runningAnimRef.current) {
            runningAnimRef.current = true;
            tlRef!.current!.play();
        }
    }

    function maybeRenderEraseButton() {
        if(props.currentTool !== ToolType.ERASER) {
            return;
        }
        return (
            <span ref={eraseButtonRef} 
                className={styles.eraserTrail}
                onClick={handleErase}>
            </span>
        );
    }
    
    return (
        <li ref={todoItemRef} className={styles.todoListItem} 
                style={getHighlightColor()}
                onClick={handleMouseUp}
                data-is-complete={props.todoListItem.isComplete}
                data-mode={props.currentTool}
                >
            {maybeRenderEraseButton()}
            <div ref={checkboxRef} className={styles.checkbox} data-tooltip={getTooltipText()} data-checked={props.todoListItem.isComplete + ""}>
                <svg className={styles.checkboxcheck} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.875 14.5195L9.77344 19.1953L19.125 4.5" stroke="black" stroke-width="6" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div ref={textRef} className={styles.todoListItemText}>{props.todoListItem.desc}</div>
        </li>
    );
}

interface ITodoListProps {
    // TODO: change tool type to context.
    currentTool: ToolType;
}

export default function TodoList(props: ITodoListProps) {
    const scrollContainerRef = useRef<HTMLDivElement|null>(null);
    const todoListOverlay = useRef<HTMLDivElement|null>(null);
    const headerRef = useRef<HTMLDivElement|null>(null);
    const inputRef = useRef<HTMLInputElement|null>(null);

    const [todoItemsData, setTodoItemsData] = useState([
        {desc: "Call mum", isComplete: false},
        {desc: "Book doctor's appointment", isComplete: false},
        {desc: "Finish history assignment", isComplete: false},
        {desc: "Buy birthday present for Addy", isComplete: false},
    ]);
    
    useEffect(() => {
        if (!scrollContainerRef?.current) {
            return;
        }
        scrollContainerRef!.current!.scrollTo({top: scrollContainerRef!.current!.scrollHeight, left: 0, behavior: 'smooth'});
      }, [getLastItem()]);

    useGSAP(() => {
        const tl = gsap.timeline({});
        tl.from(todoListOverlay!.current!, {top: "-20px", duration: 1, ease: "power2.inOut"});
        tl.from(headerRef!.current!, {y: 10, opacity: 0, duration: 0.2}, 1);
        tl.from(inputRef!.current!, {y: 10, opacity: 0, duration: 0.2}, 1);
      }, {dependencies: [], revertOnUpdate: false});

    function getLastItem(): ITodoListItem|null {
        if (todoItemsData.length === 0) return null;

        return todoItemsData[todoItemsData.length - 1];
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            // Trigger re-render
            const el: HTMLInputElement = e.target as HTMLInputElement;
            const newItem = el.value + "";
            addItem(newItem);
            el.value = "";
        }
    };

    function addItem(newItem: string) {
        const nextTodoList = todoItemsData.slice();
        nextTodoList.push({desc: newItem, isComplete: false});
        setTodoItemsData(nextTodoList);
    }

    function toggleIsComplete(index: number) {
        const nextTodoList = todoItemsData.slice();
        nextTodoList[index].isComplete = !todoItemsData[index].isComplete;
        setTodoItemsData(nextTodoList);
    }

    function deleteItem(index: number) {
        const nextTodoList = todoItemsData.slice();
        nextTodoList.splice(index, 1);
        setTodoItemsData(nextTodoList);
    }
    
    const maybeShowDisabledClass = props.currentTool !== ToolType.POINTER ? styles.todoListInputDisabled : "";
    return (
        <div className={styles.todoListWrapper}>
            <span ref={todoListOverlay} className={styles.todolistoverlay}></span>
            <div className={styles.todoListNote}>
                <h2 ref={headerRef} className={styles.todoHeading}>{noteName}</h2>
                <div ref={scrollContainerRef} className={styles.todoListScrollableContainer}>
                    <ol className={styles.todoList}>
                        {todoItemsData.map((todoListItem: ITodoListItem, i: number) => 
                            <TodoListItem key={i}
                                currentTool={props.currentTool}
                                todoListItem={todoListItem}
                                toggleItemIsComplete={() => toggleIsComplete(i)}
                                deleteItem={() => deleteItem(i)}></TodoListItem>
                        )}
                    </ol>
                </div>
                <input 
                    id="new-todo" 
                    type="text" 
                    className={`${styles.todoListInput} ${maybeShowDisabledClass}`} 
                    onKeyUp={handleKeyPress}
                    disabled={props.currentTool !== ToolType.POINTER} 
                    placeholder={inputPlaceholder}></input>
            </div>
        </div>
    );
  }