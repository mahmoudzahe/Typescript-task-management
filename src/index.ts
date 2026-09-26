import { User } from "./models/User";
import { Project } from "./models/Project";
import {
    DevelopmentTask,
    ResearchTask,
    TaskStatus
} from "./models/Task";

import { UserService } from "./services/UserService";
import { ProjectService } from "./services/ProjectService";
import { TaskService } from "./services/TaskService";
import { TaskQueryService } from "./services/TaskQueryService";
import { TaskStatisticsService } from "./services/TaskStatisticsService";

const userService = new UserService();
const projectService = new ProjectService();

const taskService = new TaskService(
    projectService,
    userService
);

const taskQueryService = new TaskQueryService(taskService);

const taskStatisticsService = new TaskStatisticsService(
    taskService
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

const developmentTask: DevelopmentTask = {
    id: "t1",
    title: "Build login page",
    projectId: "p1",
    status: TaskStatus.Todo,
    type: "development",
    component: "Login"
};

const researchTask: ResearchTask = {
    id: "t2",
    title: "Research authentication methods",
    description: "Compare authentication options",
    projectId: "p1",
    status: TaskStatus.InProgress,
    type: "research",
    researchQuestion: "Which authentication method should we use?"
};

userService.addUser(user);
projectService.addProject(project);

taskService.addTask(developmentTask);
taskService.addTask(researchTask);

taskService.assignTask("t1", "u1");

console.log(
    "Filtered:",
    taskQueryService.filterTasks({
        type: "development"
    })
);

console.log(
    "Search:",
    taskQueryService.searchTasks("authentication")
);

console.log(
    "Sorted:",
    taskQueryService.sortTasks("title", "asc")
);

taskService.updateTaskStatus("t2", TaskStatus.Done);

console.log(
    "Statistics:",
    taskStatisticsService.getStatistics()
);