import { v4 as uuidv4 } from "uuid"
import { addDays } from "date-fns"
import type { Todo } from "./types.ts"

export const initialTodos: Todo[] = [
  {
    id: uuidv4(),
    item: "todo1",
    check: false,
    value: 1,
    date: new Date(addDays(new Date(), 1)).getTime(),
  },
  {
    id: uuidv4(),
    item: "todo2",
    check: false,
    value: 2,
    date: new Date(addDays(new Date(), 2)).getTime(),
  },
  {
    id: uuidv4(),
    item: "todo3",
    check: true,
    value: 0,
    date: new Date(addDays(new Date(), 0)).getTime(),
  },
  {
    id: uuidv4(),
    item: "todo4",
    check: false,
    value: 0,
    date: new Date(addDays(new Date(), 5)).getTime(),
  },
]
