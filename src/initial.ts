import { v4 as uuidv4 } from "uuid"
import { addDays } from "date-fns"
import type { Todo } from "./types.ts"

export const initial: Todo[] = [
  {
    id: uuidv4(),
    title: "todo1",
    status: false,
    priority: "medium",
    date: new Date(addDays(new Date(), 1)).getTime(),
  },
  {
    id: uuidv4(),
    title: "todo2",
    status: false,
    priority: "low",
    date: new Date(addDays(new Date(), 2)).getTime(),
  },
  {
    id: uuidv4(),
    title: "todo3",
    status: true,
    priority: "high",
    date: new Date(addDays(new Date(), 0)).getTime(),
  },
  {
    id: uuidv4(),
    title: "todo4",
    status: false,
    priority: "high",
    date: new Date(addDays(new Date(), 5)).getTime(),
  },
]
