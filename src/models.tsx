
export enum ToolType {
    POINTER = 1,
    ERASER,
    EDITOR,
    MOVER,
}

export interface ITool {
    type: ToolType;
    lottiePath: string;
    tooltip: string;
}