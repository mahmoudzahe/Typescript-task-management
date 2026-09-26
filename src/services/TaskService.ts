import { Task, TaskStatus } from "../models/Task";
import { ProjectService } from "./ProjectService";
import { UserService } from "./UserService";

export class TaskService {
    private tasks: Task[] = [];

    constructor(
        private projectService: ProjectService,
        private userService: UserService
    ) {}

    addTask(task: Task): void {
        const existingTask = this.tasks.find(
            (currentTask) => currentTask.id === task.id
        );

        if (existingTask) {
            throw new Error("Task already exists");
        }

        const project = this.projectService.getProjectById(task.projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        if (task.assigneeId) {
            const user = this.userService.getUserById(task.assigneeId);

            if (!user) {
                throw new Error("User not found");
            }
        }

        this.tasks.push(task);
    }

    getTasks(): Task[] {
        return [...this.tasks];
    }

    getTaskById(id: string): Task | undefined {
        return this.tasks.find((task) => task.id === id);
    }

    assignTask(taskId: string, userId: string): void {
        const task = this.getTaskById(taskId);

        if (!task) {
            throw new Error("Task not found");
        }

        const user = this.userService.getUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        task.assigneeId = userId;
    }

    updateTaskStatus(taskId: string, status: TaskStatus): void {
        const task = this.getTaskById(taskId);

        if (!task) {
            throw new Error("Task not found");
        }

        task.status = status;
    }

    getTasksByProject(projectId: string): Task[] {
        return this.tasks.filter(
            (task) => task.projectId === projectId
        );
    }

    getTasksByUser(userId: string): Task[] {
        return this.tasks.filter(
            (task) => task.assigneeId === userId
        );
    }
}