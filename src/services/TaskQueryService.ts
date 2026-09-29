import {
    DevelopmentTask,
    Task,
    TaskFilter
} from "../models/Task";

import { TaskService } from "./TaskService";

export type TaskSortKey = "title" | "status";
export type SortDirection = "asc" | "desc";

export class TaskQueryService {
    constructor(private taskService: TaskService) {}

    filterTasks(filter: TaskFilter): Task[] {
        const filterKeys = Object.keys(filter) as (keyof TaskFilter)[];

        return this.taskService.getTasks().filter((task) =>
            filterKeys.every((key) =>
                filter[key] === undefined ||
                task[key] === filter[key]
            )
        );
    }

    private isDevelopmentTask(
        task: Task
    ): task is DevelopmentTask {
        return task.type === "development";
    }

    searchTasks(query: string): Task[] {
        const value = query.trim().toLowerCase();

        return this.taskService.getTasks().filter((task) => {
            const commonMatch =
                task.title.toLowerCase().includes(value) ||
                task.description?.toLowerCase().includes(value);

            if (commonMatch) {
                return true;
            }

            if (this.isDevelopmentTask(task)) {
                return task.component
                    .toLowerCase()
                    .includes(value);
            }

            return task.researchQuestion
                .toLowerCase()
                .includes(value);
        });
    }

    private compareByKey<T, K extends keyof T>(
        first: T,
        second: T,
        key: K
    ): number {
        return String(first[key]).localeCompare(
            String(second[key])
        );
    }

    sortTasks(
        key: TaskSortKey,
        direction: SortDirection = "asc"
    ): Task[] {
        const tasks = this.taskService.getTasks().sort(
            (firstTask, secondTask) =>
                this.compareByKey(
                    firstTask,
                    secondTask,
                    key
                )
        );

        return direction === "asc"
            ? tasks
            : tasks.reverse();
    }
}