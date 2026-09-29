import { Project } from "../models/Project";

export class ProjectService {
    private projects: Project[] = [];

    addProject(project: Project): void {
        const projectExists = this.projects.some(
            (currentProject) => currentProject.id === project.id
        );

        if (projectExists) {
            throw new Error("Project already exists");
        }

        this.projects.push(project);
    }

    getProjects(): Project[] {
        return [...this.projects];
    }

    getProjectById(id: string): Project | undefined {
        return this.projects.find((project) => project.id === id);
    }
}