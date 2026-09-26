import { Task, TaskFilter } from "../models/Task";
import { TaskService } from "./TaskService";

export type TaskSortKey = "title" | "status";
export type SortDirection = "asc" | "desc";

export class TaskQueryService {
    constructor(private taskService: TaskService) {}

    filterTasks(filter: TaskFilter): Task[] {
        return this.taskService.getTasks().filter((task) =>
            (filter.projectId === undefined ||
                task.projectId === filter.projectId) &&
            (filter.assigneeId === undefined ||
                task.assigneeId === filter.assigneeId) &&
            (filter.status === undefined ||
                task.status === filter.status) &&
            (filter.type === undefined ||
                task.type === filter.type)
        );
    }

    searchTasks(query: string): Task[] {
        const value = query.trim().toLowerCase();

        return this.taskService.getTasks().filter((task) =>
            task.title.toLowerCase().includes(value) ||
            task.description?.toLowerCase().includes(value)
        );
    }

    sortTasks(
        key: TaskSortKey,
        direction: SortDirection = "asc"
    ): Task[] {
        const tasks = this.taskService.getTasks().sort(
            (firstTask, secondTask) =>
                firstTask[key].localeCompare(secondTask[key])
        );

        return direction === "asc"
            ? tasks
            : tasks.reverse();
    }
}