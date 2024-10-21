'use client';

import styles from "./page.module.css";
import TodoList from "../components/todolist/todolist";
import ToolBar from "../components/todolist/toolbar";
import {ITool, ToolType} from "../models";
import { useState } from "react";

const projectName: string = "Funky Todo List";

const tools: ITool[] = [
  {
      type: ToolType.POINTER,
      lottiePath: "lottie/MouseIcon.json",
      tooltip: "pointer",
  },
  {
      type: ToolType.ERASER,
      lottiePath: "lottie/EraserIcon.json",
      tooltip: "eraser",
  }
];

export default function Home() {
  const [currentTool, setCurrentTool] = useState(ToolType.POINTER);

  return (
    <div className={styles.page} data-current-tool={currentTool}>
      <main className={styles.main}>
        <div className={styles.todolistcontainer}>
          <TodoList></TodoList>
        </div>
        <div className={styles.toolbarcontainer}>
          <ToolBar tools={tools} setCurrentTool={setCurrentTool} currentTool={currentTool}></ToolBar>
        </div>
        <h1 className={styles.logo}>{projectName}</h1>
      </main>
    </div>
  );
}
