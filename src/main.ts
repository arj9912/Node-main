import { config } from 'dotenv'
import express, { Request, Response } from 'express'
import crypto from 'crypto'

config()

interface Todo {
    id: string
    name: string
    active: boolean
}

interface TodoRequestBody {
    name: string
}

let todos: Todo[] = [{ id: crypto.randomUUID(), name: 'just a thing',active:true }]
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/todos', (req: Request, res: Response) => {
  if(req.query.active){
    res.send(todos.filter((todo)=>!todo.active))
  }
    res.send(todos)
})

app.delete('/todos/:id', (req: Request, res: Response) => {
    todos = todos.filter((todo) => todo.id !== req.params.id)
    res.sendStatus(200)
})

app.patch('/todos/:id', (req: Request, res: Response) => {
    const { name } = req.body as TodoRequestBody
    const updatedTodos = todos.map((todo) =>
        todo.id === req.params.id ? { ...todo, name } : todo
    )
    todos = updatedTodos
    res.sendStatus(200)
})

app.post('/todos', (req: Request, res: Response) => {
    const { name } = req.body as TodoRequestBody
    const newTodo: Todo = { id: crypto.randomUUID(), name ,active: true}
    todos.push(newTodo)
    res.sendStatus(201)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})