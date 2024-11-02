'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./todolist.module.css";
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ToolType, ITodoListItem } from "@/models";
import TodoListItem from "./todolistitem";
import {usePrevious} from "@/utils/hooks";

const noteName: string = "TODAY'S TASKS";
const inputPlaceholder: string = "What's next?";

const createInitialTodos = () => {
    return [
        {desc: "Call mum", isComplete: false},
        {desc: "Book doctor's appointment", isComplete: false},
        {desc: "Finish history assignment", isComplete: false},
        {desc: "Buy birthday present for Addy", isComplete: false},
    ];
};

interface ITodoListProps {
    // TODO: change tool type to context.
    currentTool: ToolType;
}

const TodoList = (props: ITodoListProps) => {
    const scrollContainerRef = useRef<HTMLDivElement|null>(null);
    const todoListOverlay = useRef<HTMLDivElement|null>(null)
    const headerRef = useRef<HTMLDivElement|null>(null);
    const inputRef = useRef<HTMLInputElement|null>(null);

    const [todoItemsData, setTodoItemsData] = useState(createInitialTodos);
    const previousItemCount = usePrevious(todoItemsData.length);
    
    useEffect(() => {
        if (!scrollContainerRef?.current) {
            return;
        }

        if (previousItemCount && previousItemCount < todoItemsData.length) {
            scrollContainerRef!.current!.scrollTo({top: scrollContainerRef!.current!.scrollHeight, left: 0, behavior: 'smooth'});
        }
      }, [todoItemsData.length]);

    useGSAP(() => {
        const tl = gsap.timeline({});
        tl.from(todoListOverlay!.current!, {top: "-20px", duration: 1, ease: "power2.inOut"});
        tl.from(headerRef!.current!, {y: 10, opacity: 0, duration: 0.2}, 1);
        tl.from(inputRef!.current!, {y: 10, opacity: 0, duration: 0.2}, 1);
      }, {dependencies: [], revertOnUpdate: false});

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            // Trigger re-render
            const el: HTMLInputElement = e.target as HTMLInputElement;
            const newItem = el.value + "";
            addItem(newItem);
            el.value = "";
        }
    };

    const addItem = useCallback((newItem: string) => {
        setTodoItemsData(todoList => {
            const newList = [...todoList];
            newList.push({desc: newItem, isComplete: false});
            return newList;
        });
    }, [todoItemsData]);

    const toggleIsComplete = useCallback((index: number) => {
        setTodoItemsData(todoItems => todoItems.map((item, i) => {
            if (i === index) {
                return {... item, isComplete: !item.isComplete};
            }
            return item;
        }));
    }, [todoItemsData]);

    const deleteItem = useCallback((index: number) => {
        setTodoItemsData(todoItems => todoItems.filter((todoItem, i) => {
            return i !== index;
        }));
    }, [todoItemsData]);
    
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

  export default TodoList;