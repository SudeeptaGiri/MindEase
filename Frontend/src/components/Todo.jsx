// src/components/Todo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaCheck, 
  FaTrash, 
  FaPlus, 
  FaCalendarAlt,
  FaSun,
  FaUsers,
  FaHeart,
  FaBriefcase,
  FaFilter,
  FaSync,
  FaClock
} from 'react-icons/fa';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('DAILY');
  const [filter, setFilter] = useState('ALL');
  const [recurrence, setRecurrence] = useState('NONE');

  const categories = {
    DAILY: { 
      icon: FaSun, 
      label: 'Daily Tasks', 
      color: 'yellow',
      description: 'Tasks to be completed every day'
    },
    WEEKLY: { 
      icon: FaCalendarAlt, 
      label: 'Weekly Goals', 
      color: 'blue',
      description: 'Goals to achieve this week'
    },
    MONTHLY: { 
      icon: FaCalendarAlt, 
      label: 'Monthly Goals', 
      color: 'purple',
      description: 'Long-term objectives'
    },
    SOCIAL: { 
      icon: FaUsers, 
      label: 'Social Connections', 
      color: 'indigo',
      description: 'Activities to maintain relationships'
    },
    SELF_CARE: { 
      icon: FaHeart, 
      label: 'Self Care', 
      color: 'red',
      description: 'Activities for personal well-being'
    },
    PROFESSIONAL: { 
      icon: FaBriefcase, 
      label: 'Professional Support', 
      color: 'green',
      description: 'Professional development and support tasks'
    }
  };

  const recurrenceOptions = [
    { value: 'NONE', label: 'No Recurrence', icon: FaClock },
    { value: 'DAILY', label: 'Daily', icon: FaSun },
    { value: 'WEEKLY', label: 'Weekly', icon: FaCalendarAlt },
    { value: 'MONTHLY', label: 'Monthly', icon: FaCalendarAlt }
  ];

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(fetchTodos, 1000 * 60 * 60); // Refresh every hour
    return () => clearInterval(interval);
  }, []);

  const fetchTodos = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.id) {
        toast.error('Please log in to view your tasks');
        return;
      }

      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/todos/user/${user.id}/daily`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load tasks');
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTask.trim()) {
      toast.warning('Please enter a task description');
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.id) {
        toast.error('Please log in to add tasks');
        return;
      }

      const taskData = {
        task: newTask,
        category: selectedCategory,
        userId: user.id,
        recurring: recurrence !== 'NONE',
        recurrencePattern: recurrence,
        scheduledDate: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:8080/api/todos', taskData);
      setTodos(prev => [...prev, response.data]);
      setNewTask('');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add task');
    }
  };

  const toggleTodo = async (taskId) => {
    try {
      const task = todos.find(t => t.id === taskId);
      const response = await axios.put(`http://localhost:8080/api/todos/${taskId}`, {
        completed: !task.completed
      });
      
      if (response.data.recurring && response.data.completed) {
        fetchTodos(); // Refresh to get the new recurring instance
      } else {
        setTodos(prev => prev.map(t => 
          t.id === taskId ? response.data : t
        ));
      }
      
      toast.success(`Task ${response.data.completed ? 'completed' : 'uncompleted'}`);
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${taskId}`);
      setTodos(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    }
  };

  const filteredTodos = todos.filter(todo => {
    const categoryMatch = selectedCategory === 'ALL' || todo.category === selectedCategory;
    const statusMatch = filter === 'ALL' || 
      (filter === 'COMPLETED' && todo.completed) || 
      (filter === 'PENDING' && !todo.completed);
    return categoryMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Task Manager</h2>

          {/* Add Task Form */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {Object.entries(categories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {recurrenceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={addTodo}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'ALL' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'PENDING' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'COMPLETED' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tasks found. Add some tasks to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
                    todo.completed ? 'bg-green-50' : 'bg-gray-50'
                  } hover:shadow-md`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 mr-3"
                  >
                    {todo.completed ? (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full hover:border-teal-500" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.task}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      {React.createElement(categories[todo.category]?.icon, {
                        className: "h-4 w-4 mr-1"
                      })}
                      <span>{categories[todo.category]?.label}</span>
                      {todo.recurring && (
                        <span className="ml-2 flex items-center">
                          <FaSync className="h-3 w-3 mr-1" />
                          {todo.recurrencePattern.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;