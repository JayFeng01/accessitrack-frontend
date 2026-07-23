import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    axios.get('https://accessitrack-backend.onrender.com/api/tasks')
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        console.error('Error fetching tasks:', error)
      })
  }, [])

  function handleAddTask() {
    axios.post('https://accessitrack-backend.onrender.com/api/tasks', {
      title: newTaskTitle,
      description: '',
      dueDate: '',
      completed: false,
      priority: 'Medium'
    })
      .then(response => {
        setTasks([...tasks, response.data])
        setNewTaskTitle('')
      })
      .catch(error => {
        console.error('Error adding task:', error)
      })
  }

  function handleDeleteTask(id) {
    axios.delete(`https://accessitrack-backend.onrender.com/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id))
      })
      .catch(error => {
        console.error('Error deleting task:', error)
      })
  }

  function handleToggleComplete(task) {
    axios.put(`https://accessitrack-backend.onrender.com/api/tasks/${task.id}`, {
      ...task,
      completed: !task.completed
    })
      .then(response => {
        setTasks(tasks.map(t => t.id === task.id ? response.data : t))
      })
      .catch(error => {
        console.error('Error updating task:', error)
      })
  }

  return (
    <main
      className={highContrast ? 'high-contrast' : ''}
      style={{ fontSize: `${fontSize}px` }}
    >
      <h1>Accessitrack</h1>
      <button
        onClick={() => setHighContrast(!highContrast)}
        aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
      >
        Toggle High Contrast
      </button>
      <button onClick={() => setFontSize(fontSize + 2)} aria-label="Increase font size">
        A+
      </button>
      <button onClick={() => setFontSize(fontSize - 2)} aria-label="Decrease font size">
        A-
      </button>

      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        aria-label="New task title"
      />
      <button onClick={handleAddTask}>
        Add Task
      </button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
              aria-label={`Mark "${task.title}" as complete`}
            />
            {task.title}
            <button onClick={() => handleDeleteTask(task.id)} aria-label={`Delete "${task.title}"`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
