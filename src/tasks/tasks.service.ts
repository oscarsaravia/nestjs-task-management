import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto
    let tasks = this.getAllTasks()
    if (status) {
      tasks = tasks.filter((task) => {
        return task.status === status
      })
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return  true
        }
        return false
      })
    }

    return tasks
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((item) => {
      return item.id === id
    })
    if (task) return task
    return { id: '', title: '', description: '', status: TaskStatus.DONE}
  }

  createTask(createTAskDto: CreateTaskDto): Task {
    const { title, description } = createTAskDto
    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN
    }
    this.tasks.push(task)
    return task
  }

  deleteTask(id: string): Task[] {
    const newTasks = this.tasks.filter((task) => {
      return task.id !== id
    })
    this.tasks = newTasks
    return this.tasks
  }

  updateTaskStatus(id:string, status: TaskStatus): Task {
    const task = this.getTaskById(id)
    task.status = status
    return task
  }
}
