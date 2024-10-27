'use client';

import Intro from "../components/intro/intro";
import TodoList from "../components/todolist/todolist";
import ToolBar from "../components/toolbar/toolbar";
import gsap from "gsap";
import styles from "./page.module.css";
import {ITool, ToolType} from "../models";
import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";

const projectName: string = "Funky Todo List";

const tools: ITool[] = [
  {
      type: ToolType.POINTER,
      lottiePath: "lottie/MouseIcon.json",
      tooltip: "pointer",
      shortcut: "p",
  },
  {
      type: ToolType.ERASER,
      lottiePath: "lottie/EraserIcon.json",
      tooltip: "eraser",
      shortcut: "r",
  }
];

function MainApp() {
  const [currentTool, setCurrentTool] = useState(ToolType.POINTER);
  
  const toolbarRef = useRef<HTMLDivElement|null>(null);
  const headerRef = useRef<HTMLDivElement|null>(null);

  useGSAP(() => {
    const tl = gsap.timeline({});
    tl.from(headerRef!.current!, {y: 100, opacity: 0, duration: 0.4});
    tl.from(toolbarRef!.current!, {x: 100, opacity: 0, duration: 0.4}, "<0.6");
  }, {dependencies: [toolbarRef, headerRef], revertOnUpdate: true});

  return (
    <div className={styles.page} data-current-tool={currentTool}>
      <main className={styles.main}>
        <div className={styles.todolistcontainer}>
          <TodoList currentTool={currentTool}></TodoList>
        </div>
        <div  ref={toolbarRef} className={styles.toolbarcontainer}>
          <ToolBar tools={tools} setCurrentTool={setCurrentTool} currentTool={currentTool}></ToolBar>
        </div>
        <h3 ref={headerRef} className={styles.logo}>{projectName}</h3>
      </main>
    </div>
  );
}

export default function Home() {
  const [introComplete, setIntroComplete] = useState(true);

  if (!introComplete) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <Intro onIntroComplete={() =>  setIntroComplete(true)}></Intro>
        </main>
      </div>
    );
  }

  return (
    <MainApp></MainApp>
  );
}
