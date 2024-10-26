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
    const eraseAnimRef = useRef<HTMLDivElement|null>(null);

    function handleMouseUp() {
        switch(props.currentTool) {
            case ToolType.POINTER:
                props.toggleItemIsComplete();
                break;
            case ToolType.ERASER:
                props.deleteItem();
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
                    // "--highlight-background": "var(--primary-yellow)",
                    "--highlight-background": "white",
                    "--highlight-foreground": "black",
                } as CSSProperties;
            default:
                return {
                    "--highlight-background": "black",
                    "--highlight-foreground": "white",
                } as CSSProperties;
        }
    }

    const maybeShowDisabledClass = props.currentTool !== ToolType.POINTER ? styles.todoListItemCheckboxDisabled : "";
    return (
        <li className={styles.todoListItem} onClick={handleMouseUp} 
            data-is-complete={props.todoListItem.isComplete}
            data-mode={props.currentTool}
            style={getHighlightColor()}>
            <span ref={eraseAnimRef} className={styles.todoListItemErase}></span>
            <div ref={checkboxRef} className={`${styles.checkbox} ${maybeShowDisabledClass}`} data-tooltip={getTooltipText()} data-checked={props.todoListItem.isComplete + ""}>
                <svg className={styles.checkboxcheck} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.875 14.5195L9.77344 19.1953L19.125 4.5" stroke="black" stroke-width="6" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div className={styles.todoListItemText}>{props.todoListItem.desc}</div>
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
    const prevCount = useRef<number>(todoItemsData.length);

    useEffect(() => {
        if (scrollContainerRef?.current === null) {
            return;
        }
        if (prevCount?.current < todoItemsData.length) {
            scrollContainerRef!.current!.scrollTo({top: scrollContainerRef!.current!.scrollHeight, left: 0, behavior: 'smooth'});
            prevCount!.current! = todoItemsData.length;
        }
      }, [todoItemsData]);

    useGSAP(() => {
        const tl = gsap.timeline({});
        tl.from(todoListOverlay!.current!, {top: "-20px", duration: 1, ease: "power2.inOut"});
        tl.from(headerRef!.current!, {y: 10, opacity: 0, duration: 0.2}, 1);
        tl.from(inputRef!.current!, {y: 10, opacity: 0, duration: 0.2}, 1);
      }, {dependencies: [inputRef, headerRef], revertOnUpdate: true});

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