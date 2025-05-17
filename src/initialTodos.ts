import {v4 as uuidv4} from "uuid";
import {addDays} from "date-fns";
import type {Todo} from "./types.ts";

export const initialTodos:Todo[] = [
    {
        id: uuidv4(),
        todoText: "todo1",
        completed: false,
        priority: "medium",
        dueDateMs: new Date(addDays(new Date(), 1)).getTime(),
    },
    {
        id: uuidv4(),
        todoText: "todo2",
        completed: false,
        priority: "low",
        dueDateMs: new Date(addDays(new Date(), 2)).getTime(),
    },
    {
        id: uuidv4(),
        todoText: "todo3",
        completed: true,
        priority: "high",
        dueDateMs: new Date(addDays(new Date(), 0)).getTime(),
    },
    {
        id: uuidv4(),
        todoText: "todo4",
        completed: false,
        priority: "high",
        dueDateMs: new Date(addDays(new Date(), 5)).getTime(),
    }
]