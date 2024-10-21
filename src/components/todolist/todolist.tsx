'use client';

import styles from "./todolist.module.css";
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

const noteName: string = "My note";
const inputPlaceholder: string = "So much to do...";

/** Interface for representing a todo item. */
interface TodoListItem {
    name: String;
    isComplete: boolean;
}

interface TodoListItemProps {
    todoItem: String;
}

function TodoListItem(props: TodoListItemProps) {
    const checkboxRef = useRef<HTMLDivElement|null>(null);
    const [isChecked, setIsChecked] = useState(false);

    function handleMouseUp(e: React.MouseEvent<HTMLElement>) {
        setIsChecked(!isChecked);
    }

    return (
        <li className={styles.todoListItem} onClick={handleMouseUp}>
            <div ref={checkboxRef} className={styles.checkbox} data-checked={isChecked + ""}>
                <svg className={styles.checkboxcheck} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.875 14.5195L9.77344 19.1953L19.125 4.5" stroke="black" stroke-width="6" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div className={styles.todoListItemText}>{props.todoItem}</div>
        </li>
    );
}

export default function TodoList() {
    const scrollContainerRef = useRef<HTMLDivElement|null>(null);

    const [todoItemsData, setTodoItemsData] = useState([
        "Call mum",
        "Book doctor's appointment",
        "Finish history assignment",
        "Buy birthday present for Addy",
    ]);

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            // Trigger re-render
            const nextTodoList = todoItemsData.slice();
            const el: HTMLInputElement = e.target as HTMLInputElement;
            const newItem = el.value + "";
            nextTodoList.push(newItem);
            setTodoItemsData(nextTodoList);
            el.value = "";
        }
    };

    useEffect(() => {
        if (scrollContainerRef?.current === null) {
            return;
        }
        scrollContainerRef!.current!.scrollTo({top: scrollContainerRef!.current!.scrollHeight, left: 0, behavior: 'smooth'});
      }, [todoItemsData]);
    
    return (
        <>
            <div className={styles.todoListNote}>
                <h2 className={styles.todoHeading}>{noteName}</h2>
                <div ref={scrollContainerRef} className={styles.todoListScrollableContainer}>
                    <ol className={styles.todoList}>
                        {todoItemsData.map((todoItem: string, i: number) => 
                            <TodoListItem key={i} todoItem={todoItem}></TodoListItem>
                        )}
                    </ol>
                </div>
                <input onKeyUp={handleKeyPress} className={styles.todoListInput} type="text" id="new-todo" placeholder={inputPlaceholder}></input>
            </div>
        </>
    );
  }