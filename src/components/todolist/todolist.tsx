
'use client';

import styles from "./todolist.module.css";
import { useRef, useState, useEffect } from 'react';

const noteName: string = "My note";
const inputPlaceholder: string = "So much to do...";

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
            console.log("test")
            // Trigger re-render
            const nextTodoList = todoItemsData.slice();
            const el: HTMLInputElement = e.target as HTMLInputElement;
            nextTodoList.push(el.value + "");
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
                <div ref={scrollContainerRef} className={styles.todoListScrollableContainer}>
                    <h2>{noteName}</h2>
                    <ol className={styles.todoList}>
                        {todoItemsData.map((todoItem: string, i: number) => 
                            <li key={i} className={styles.todoListItem}>{todoItem}</li>
                            )
                        }
                    </ol>
                </div>
                <input onKeyUp={handleKeyPress} className={styles.todoListInput} type="text" id="new-todo" placeholder={inputPlaceholder}></input>
            </div>
        </>
    );
  }