export enum TaskStatus {
    Todo = "todo",
    InProgress = "in-progress",
    Done = "done"
}

interface BaseTask {
    readonly id: string;
    title: string;
    description?: string;
    readonly projectId: string;
    assigneeId?: string;
    status: TaskStatus;
    dueDate?: Date;
}

export interface DevelopmentTask extends BaseTask {
    type: "development";
    component: string;
}

export interface ResearchTask extends BaseTask {
    type: "research";
    researchQuestion: string;
}

export type Task = DevelopmentTask | ResearchTask;

export type TaskFilter = Partial<
    Pick<Task, "projectId" | "assigneeId" | "status" | "type">
>;