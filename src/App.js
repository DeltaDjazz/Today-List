import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Faire 100 pompes', text: 'Faire 5 séries de 20 pompes ', status: 'todo' },
    { id: 2, title: 'Faire le Ménage au salon, cuisine et salle de bain', text: '', status: 'todo' },
    { id: 3, title: 'Dessin d\'observation', text: 'Faire 3 dessins d\'objets des alentours', status: 'todo' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // Tâche sélectionnée pour la popin
  const inputRef = useRef(null);

  // Focus automatique sur le champ de titre lorsque la modal s'ouvre
  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const moveTask = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        text: newTaskText,
        status: 'todo',
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskText('');
      setShowModal(false);
    }
  };

  // Gestion de la touche "Entrée"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Ouvrir la popin avec les détails de la tâche
  const openTaskDetails = (task) => {
    if (task.text) {
      setSelectedTask(task);
    }
  };

  // Fermer la popin
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container mt-5">
      {/* Header avec titre */}
      <div className="header mb-4">
        <h1 className="text-center">Ma To-Do List</h1>
        <hr className="header-divider" />
      </div>

      {/* Bouton pour ouvrir la modal */}
      <button
        className="btn btn-primary mb-4 add-task-button"
        onClick={() => setShowModal(true)}
      >
        + Ajouter une tâche
      </button>

      {/* Tableau avec bordures et fond gris */}
      <div className="row board">
        <div className="col-lg-4 column">
          <section className="h-100">
            <h2>À faire</h2>
            <TaskList
              tasks={tasks}
              status="todo"
              moveTask={moveTask}
              deleteTask={deleteTask}
              openTaskDetails={openTaskDetails}
            />
          </section>
        </div>
        <div className="col-lg-4 column">
          <section className="h-100">
            <h2>En cours</h2>
            <TaskList
              tasks={tasks}
              status="en cours"
              moveTask={moveTask}
              deleteTask={deleteTask}
              openTaskDetails={openTaskDetails}
            />
          </section>
        </div>
        <div className="col-lg-4 column">
          <section className="h-100">
            <h2>Terminé</h2>
            <TaskList
              tasks={tasks}
              status="terminé"
              moveTask={moveTask}
              deleteTask={deleteTask}
              openTaskDetails={openTaskDetails}
            />
          </section>
        </div>
      </div>

      {/* Modal pour ajouter une tâche */}
      <div
        className={`modal ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-notion">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter une tâche</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Titre de la tâche"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
              <textarea
                className="form-control"
                placeholder="Description de la tâche (optionnel)"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addTask}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popin pour afficher les détails de la tâche */}
      {selectedTask && (
        <div
          className="modal show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-notion">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTask.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeTaskDetails}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedTask.text}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeTaskDetails}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskList({ tasks, status, moveTask, deleteTask, openTaskDetails }) {
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'todo':
        return 'en cours';
      case 'en cours':
        return 'terminé';
      default:
        return null;
    }
  };

  return (
    <div className="task-list">
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <div key={task.id} className="card task-card">
            <div className="card-body">
              {/* Bouton pour supprimer la tâche */}
              <button
                className="btn btn-sm text-muted bg-white delete-button"
                onClick={() => deleteTask(task.id)}
              >
                ×
              </button>
              {/* Titre de la tâche */}
              <p
                className={`task-title ${task.text ? 'has-text' : ''}`}
                onClick={() => openTaskDetails(task)}
              >
                {task.title}
              </p>
              {/* Bouton pour déplacer la tâche vers la colonne de droite */}
              {getNextStatus(task.status) && (
                <button
                  className="btn btn-sm text-primary bg-white move-button"
                  onClick={() => moveTask(task.id, getNextStatus(task.status))}
                >
                  →
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;