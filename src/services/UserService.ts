import { User } from "../models/User";

export class UserService {
    private users: User[] = [];

    addUser(user: User): void {
        const userExists = this.users.some(
            (currentUser) =>
                currentUser.id === user.id ||
                currentUser.email === user.email
        );

        if (userExists) {
            throw new Error("User already exists");
        }

        this.users.push(user);
    }

    getUsers(): User[] {
        return [...this.users];
    }

    getUserById(id: string): User | undefined {
        return this.users.find((user) => user.id === id);
    }
}