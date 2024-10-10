
import styles from "./todolist.module.css";

const todoItemsData: string[] = [
    "Call mum",
    "Book doctor's appointment",
    "Finish history assignment",
    "Buy birthday present for Addy",
];

const noteName: string = "My note";
const inputPlaceholder: string = "So much to do...";

export default function TodoList() {
    return (
        <>
            <div className={styles.todoListNote}>
                <h2>{noteName}</h2>
                <ol className={styles.todoList}>
                    {todoItemsData.map((todoItem: string, i: number) => 
                        <li key={i} className={styles.todoListItem}>{todoItem}</li>
                        )
                    }
                </ol>
                <input className={styles.todoListInput} type="text" id="new-todo" placeholder={inputPlaceholder}></input>
            </div>
        </>
    );
  }