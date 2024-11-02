
export enum ToolType {
    POINTER = 1,
    ERASER = 2,
    MOVER = 3,
}

export interface ITool {
    type: ToolType;
    lottiePath: string;
    tooltip: string;
    shortcut: string;
}

export interface ITodoListItem {
    desc: string;
    isComplete?: boolean;
}