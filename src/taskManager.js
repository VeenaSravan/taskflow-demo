/**
 * TaskFlow — Core task management logic.
 * Works as a Node.js module (for Jest tests) and as a browser global.
 */
(function (exports) {
  'use strict';

  var _idCounter = 0;

  function _nextId() {
    return ++_idCounter;
  }

  function createTask(text, priority, dueDate) {
    return {
      id: _nextId(),
      text: text,
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Returns a new array with the given task appended.
   * Throws if text is empty or whitespace-only.
   */
  function addTask(tasks, text, priority, dueDate) {
    var trimmed = (text || '').trim();
    if (!trimmed) {
      throw new Error('Task text cannot be empty');
    }
    return tasks.concat([createTask(trimmed, priority, dueDate)]);
  }

  /**
   * Returns a new array with the matching task's completed flag toggled.
   */
  function toggleTask(tasks, id) {
    return tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });
  }

  /**
   * Returns a new array with the matching task removed.
   */
  function deleteTask(tasks, id) {
    return tasks.filter(function (task) {
      return task.id !== id;
    });
  }

  /**
   * Returns a new array with all completed tasks removed.
   */
  function clearCompleted(tasks) {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  /**
   * Returns the number of active (incomplete) tasks.
   */
  function getActiveCount(tasks) {
    return tasks.filter(function (task) { return !task.completed; }).length;
  }

  /**
   * Returns tasks filtered by the given filter string.
   * filter: 'all' | 'active' | 'completed'
   */
  function filterTasks(tasks, filter) {
    if (filter === 'active') {
      return tasks.filter(function (task) { return !task.completed; });
    }
    if (filter === 'completed') {
      return tasks.filter(function (task) { return task.completed; });
    }
    return tasks;
  }

  /**
   * Parses a 'YYYY-MM-DD' string as a local date (avoids timezone shifts).
   * Returns null if the value is missing or malformed.
   */
  function parseDueDate(dueDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dueDate || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  /**
   * True if the task is incomplete and its due date is before today.
   */
  function isOverdue(task, now) {
    var due = parseDueDate(task.dueDate);
    if (!due || task.completed) return false;
    var d = now || new Date();
    var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return due < today;
  }

  exports.createTask = createTask;
  exports.parseDueDate = parseDueDate;
  exports.isOverdue = isOverdue;
  exports.addTask = addTask;
  exports.toggleTask = toggleTask;
  exports.deleteTask = deleteTask;
  exports.clearCompleted = clearCompleted;
  exports.getActiveCount = getActiveCount;
  exports.filterTasks = filterTasks;

})(typeof module !== 'undefined' ? module.exports : (window.TaskManager = {}));
