import styles from "./page.module.css";
import TodoList from "../components/todolist/todolist";

const projectName: string = "Funky Todo List";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TodoList></TodoList>
        <h1 className={styles.logo}>{projectName}</h1>
      </main>
    </div>
  );
}
