import { User } from "./models/User";
import { Project } from "./models/Project";
import {
    DevelopmentTask,
    TaskStatus
} from "./models/Task";

import { UserService } from "./services/UserService";
import { ProjectService } from "./services/ProjectService";
import { TaskService } from "./services/TaskService";

const userService = new UserService();
const projectService = new ProjectService();

const taskService = new TaskService(
    projectService,
    userService
);

const user: User = {
    id: "u1",
    name: "Mahmoud",
    email: "mahmoud@example.com"
};

const project: Project = {
    id: "p1",
    name: "Website Project",
    description: "Build a company website"
};

const task: DevelopmentTask = {
    id: "t1",
    title: "Build login page",
    projectId: "p1",
    status: TaskStatus.Todo,
    type: "development",
    component: "Login"
};

userService.addUser(user);
projectService.addProject(project);
taskService.addTask(task);

taskService.assignTask("t1", "u1");

taskService.updateTaskStatus(
    "t1",
    TaskStatus.InProgress
);

console.log(taskService.getTasks());