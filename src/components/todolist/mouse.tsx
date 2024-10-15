'use client';

import { useState } from "react";
import styles from "./mouse.module.css";

enum MouseType {
    POINTER,
    ERASER,
    EDITOR,
    MOVER,
}

export default function Mouse() {
    const [mouseType, setMouseType] = useState(MouseType.POINTER);
    
    return (
        <div className={styles.mouse}></div>
    );
}