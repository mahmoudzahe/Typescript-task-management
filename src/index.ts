import * as readline from "readline";

import { User } from "./models/User";
import { Project } from "./models/Project";
import {
    DevelopmentTask,
    ResearchTask,
    TaskFilter,
    TaskStatus
} from "./models/Task";

import { UserService } from "./services/UserService";
import { ProjectService } from "./services/ProjectService";
import { TaskService } from "./services/TaskService";
import {
    SortDirection,
    TaskQueryService,
    TaskSortKey
} from "./services/TaskQueryService";
import { TaskStatisticsService } from "./services/TaskStatisticsService";

const userService = new UserService();
const projectService = new ProjectService();

const taskService = new TaskService(
    projectService,
    userService
);

const taskQueryService = new TaskQueryService(
    taskService
);

const taskStatisticsService = new TaskStatisticsService(
    taskService
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

function getTaskStatus(
    value: string
): TaskStatus | undefined {
    switch (value.toLowerCase()) {
        case "todo":
            return TaskStatus.Todo;

        case "in-progress":
            return TaskStatus.InProgress;

        case "done":
            return TaskStatus.Done;

        default:
            return undefined;
    }
}

function getTaskType(
    value: string
): "development" | "research" | undefined {
    const type = value.toLowerCase();

    if (
        type === "development" ||
        type === "research"
    ) {
        return type;
    }

    return undefined;
}

async function addUser(): Promise<void> {
    const id = await ask("Enter user ID: ");
    const name = await ask("Enter user name: ");
    const email = await ask("Enter user email: ");

    const user: User = {
        id,
        name,
        email
    };

    userService.addUser(user);

    console.log("User added successfully.");
}

function viewUsers(): void {
    const users = userService.getUsers();

    if (users.length === 0) {
        console.log("No users found.");
        return;
    }

    console.table(users);
}

async function addProject(): Promise<void> {
    const id = await ask("Enter project ID: ");
    const name = await ask("Enter project name: ");

    const description = await ask(
        "Enter project description (optional): "
    );

    const project: Project = {
        id,
        name,
        ...(description && { description })
    };

    projectService.addProject(project);

    console.log("Project added successfully.");
}

function viewProjects(): void {
    const projects = projectService.getProjects();

    if (projects.length === 0) {
        console.log("No projects found.");
        return;
    }

    console.table(projects);
}

async function addTask(): Promise<void> {
    const id = await ask("Enter task ID: ");
    const title = await ask("Enter task title: ");

    const description = await ask(
        "Enter task description (optional): "
    );

    const projectId = await ask(
        "Enter project ID: "
    );

    const assigneeId = await ask(
        "Enter assignee user ID (optional): "
    );

    const dueDateInput = await ask(
        "Enter due date YYYY-MM-DD (optional): "
    );

    let dueDate: Date | undefined;

    if (dueDateInput) {
        const parsedDate = new Date(dueDateInput);

        if (Number.isNaN(parsedDate.getTime())) {
            console.log("Invalid due date.");
            return;
        }

        dueDate = parsedDate;
    }

    const typeInput = await ask(
        "Enter task type (development / research): "
    );

    const type = getTaskType(typeInput);

    if (!type) {
        console.log("Invalid task type.");
        return;
    }

    const commonTaskData = {
        id,
        title,
        projectId,
        status: TaskStatus.Todo,
        ...(description && { description }),
        ...(assigneeId && { assigneeId }),
        ...(dueDate && { dueDate })
    };

    if (type === "development") {
        const component = await ask(
            "Enter development component: "
        );

        const task: DevelopmentTask = {
            ...commonTaskData,
            type: "development",
            component
        };

        taskService.addTask(task);
    } else {
        const researchQuestion = await ask(
            "Enter research question: "
        );

        const task: ResearchTask = {
            ...commonTaskData,
            type: "research",
            researchQuestion
        };

        taskService.addTask(task);
    }

    console.log("Task added successfully.");
}

async function assignTask(): Promise<void> {
    const taskId = await ask("Enter task ID: ");
    const userId = await ask("Enter user ID: ");

    taskService.assignTask(
        taskId,
        userId
    );

    console.log("Task assigned successfully.");
}

async function updateTaskStatus(): Promise<void> {
    const taskId = await ask("Enter task ID: ");

    const statusInput = await ask(
        "Enter new status (todo / in-progress / done): "
    );

    const status = getTaskStatus(statusInput);

    if (!status) {
        console.log("Invalid task status.");
        return;
    }

    taskService.updateTaskStatus(
        taskId,
        status
    );

    console.log(
        "Task status updated successfully."
    );
}

function viewAllTasks(): void {
    const tasks = taskService.getTasks();

    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    console.table(tasks);
}

async function viewTasksByProject(): Promise<void> {
    const projectId = await ask(
        "Enter project ID: "
    );

    const tasks =
        taskService.getTasksByProject(
            projectId
        );

    if (tasks.length === 0) {
        console.log(
            "No tasks found for this project."
        );
        return;
    }

    console.table(tasks);
}

async function viewTasksByUser(): Promise<void> {
    const userId = await ask(
        "Enter user ID: "
    );

    const tasks =
        taskService.getTasksByUser(
            userId
        );

    if (tasks.length === 0) {
        console.log(
            "No tasks found for this user."
        );
        return;
    }

    console.table(tasks);
}

async function searchTasks(): Promise<void> {
    const query = await ask(
        "Enter search text: "
    );

    const tasks =
        taskQueryService.searchTasks(
            query
        );

    if (tasks.length === 0) {
        console.log(
            "No matching tasks found."
        );
        return;
    }

    console.table(tasks);
}

async function filterTasks(): Promise<void> {
    const projectId = await ask(
        "Project ID (leave empty to ignore): "
    );

    const assigneeId = await ask(
        "Assignee ID (leave empty to ignore): "
    );

    const statusInput = await ask(
        "Status todo / in-progress / done (leave empty to ignore): "
    );

    const typeInput = await ask(
        "Type development / research (leave empty to ignore): "
    );

    let status: TaskStatus | undefined;

    if (statusInput) {
        status = getTaskStatus(statusInput);

        if (!status) {
            console.log("Invalid task status.");
            return;
        }
    }

    let type: "development" | "research" | undefined;

    if (typeInput) {
        type = getTaskType(typeInput);

        if (!type) {
            console.log("Invalid task type.");
            return;
        }
    }

    const filter: TaskFilter = {
        ...(projectId && { projectId }),
        ...(assigneeId && { assigneeId }),
        ...(status && { status }),
        ...(type && { type })
    };

    const tasks =
        taskQueryService.filterTasks(filter);

    if (tasks.length === 0) {
        console.log("No matching tasks found.");
        return;
    }

    console.table(tasks);
}

async function sortTasks(): Promise<void> {
    const keyInput = await ask(
        "Sort by title or status: "
    );

    if (
        keyInput !== "title" &&
        keyInput !== "status"
    ) {
        console.log("Invalid sort key.");
        return;
    }

    const directionInput = await ask(
        "Direction asc or desc: "
    );

    if (
        directionInput !== "asc" &&
        directionInput !== "desc"
    ) {
        console.log(
            "Invalid sort direction."
        );
        return;
    }

    const key: TaskSortKey = keyInput;

    const direction: SortDirection =
        directionInput;

    const tasks =
        taskQueryService.sortTasks(
            key,
            direction
        );

    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    console.table(tasks);
}

function viewStatistics(): void {
    const statistics =
        taskStatisticsService.getStatistics();

    console.log("\nTask Statistics:");

    console.log({
        ...statistics,
        completionRate:
            `${statistics.completionRate}%`
    });
}

function showMenu(): void {
    console.log(
        "\n===== Task Management System ====="
    );

    console.log("1. Add User");
    console.log("2. View Users");
    console.log("3. Add Project");
    console.log("4. View Projects");
    console.log("5. Add Task");
    console.log("6. Assign / Reassign Task");
    console.log("7. Update Task Status");
    console.log("8. View All Tasks");
    console.log("9. View Tasks by Project");
    console.log("10. View Tasks by User");
    console.log("11. Search Tasks");
    console.log("12. Filter Tasks");
    console.log("13. Sort Tasks");
    console.log("14. View Statistics");
    console.log("0. Exit");
}

function showError(error: unknown): void {
    if (error instanceof Error) {
        console.log(
            `Error: ${error.message}`
        );
        return;
    }

    console.log("Unexpected error.");
}

async function main(): Promise<void> {
    let running = true;

    while (running) {
        showMenu();

        const choice = await ask(
            "\nChoose an option: "
        );

        try {
            switch (choice) {
                case "1":
                    await addUser();
                    break;

                case "2":
                    viewUsers();
                    break;

                case "3":
                    await addProject();
                    break;

                case "4":
                    viewProjects();
                    break;

                case "5":
                    await addTask();
                    break;

                case "6":
                    await assignTask();
                    break;

                case "7":
                    await updateTaskStatus();
                    break;

                case "8":
                    viewAllTasks();
                    break;

                case "9":
                    await viewTasksByProject();
                    break;

                case "10":
                    await viewTasksByUser();
                    break;

                case "11":
                    await searchTasks();
                    break;

                case "12":
                    await filterTasks();
                    break;

                case "13":
                    await sortTasks();
                    break;

                case "14":
                    viewStatistics();
                    break;

                case "0":
                    running = false;
                    console.log("Goodbye.");
                    break;

                default:
                    console.log(
                        "Invalid option."
                    );
            }
        } catch (error: unknown) {
            showError(error);
        }
    }

    rl.close();
}

main();