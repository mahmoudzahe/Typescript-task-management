import { TaskStatus } from "../models/Task";
import { TaskService } from "./TaskService";

export interface TaskStatistics {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
    assignedTasks: number;
    unassignedTasks: number;
    developmentTasks: number;
    researchTasks: number;
    completionRate: number;
}

export class TaskStatisticsService {
    constructor(private taskService: TaskService) {}

    getStatistics(): TaskStatistics {
        const tasks = this.taskService.getTasks();

        const statistics = tasks.reduce(
            (result, task) => {
                result.total++;

                if (task.status === TaskStatus.Todo) {
                    result.todo++;
                }

                if (task.status === TaskStatus.InProgress) {
                    result.inProgress++;
                }

                if (task.status === TaskStatus.Done) {
                    result.done++;
                }

                if (task.assigneeId !== undefined) {
                    result.assignedTasks++;
                } else {
                    result.unassignedTasks++;
                }

                if (task.type === "development") {
                    result.developmentTasks++;
                } else {
                    result.researchTasks++;
                }

                if (
                    task.dueDate &&
                    task.dueDate < new Date() &&
                    task.status !== TaskStatus.Done
                ) {
                    result.overdue++;
                }

                return result;
            },
            {
                total: 0,
                todo: 0,
                inProgress: 0,
                done: 0,
                overdue: 0,
                assignedTasks: 0,
                unassignedTasks: 0,
                developmentTasks: 0,
                researchTasks: 0
            }
        );

        const completionRate =
            statistics.total === 0
                ? 0
                : Math.round(
                    (statistics.done / statistics.total) * 100
                );

        return {
            ...statistics,
            completionRate
        };
    }
}