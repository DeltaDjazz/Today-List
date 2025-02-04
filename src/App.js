import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styled from '@emotion/styled';

// Les styles existants restent identiques jusqu'au Ticket
const Container = styled.div`
  padding: 20px;
  background: #f7f8fc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 900px;
`;

const BoardTitle = styled.h1`
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: #4a9eff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #3d8be0;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 0px;
  background: #ebecf0;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColumnHeader = styled.h2`
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #bdbdbd;
  color: #333;
  font-size: 18px;
`;

const TicketList = styled.div`
  min-height: 100px;
  background: ${props => props.isDraggingOver ? '#f0f7ff' : 'transparent'};
  transition: background-color 0.2s ease;
  border-radius: 5px;
  padding: 8px;
`;

// Modification du style Ticket pour gérer le positionnement relatif
const Ticket = styled.div`
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;
  background: white;
  box-shadow: ${props => props.isDragging ? '0 5px 10px rgba(0, 0, 0, 0.15)' : '0 2px 3px rgba(0, 0, 0, 0.05)'};
  user-select: none;
  
  &:hover {
    background: #fafafa;
  }

  h3 {
    font-size: 14px;
    margin: 0 0 8px 0;
    padding-right: 24px; // Espace pour le bouton de suppression
    overflow-wrap: break-word;
  }
    
  p {
    font-size: 12px;
    margin: 0;
    color: #666;
    overflow-wrap: break-word;
  }
`;



// Nouveau style pour le bouton de suppression
const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    color: #ff4444;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-right:40px;
`;

const EditInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
`;

const EditTextarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  resize: vertical;
  min-height: 60px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: ${props => props.variant === 'cancel' ? '#f0f0f0' : '#4a9eff'};
  color: ${props => props.variant === 'cancel' ? '#333' : 'white'};

  &:hover {
    background: ${props => props.variant === 'cancel' ? '#e0e0e0' : '#3d8be0'};
  }
`;

// Modification du composant EditableTicket pour inclure le bouton de suppression
const EditableTicket = ({ ticket, isEditing, onSave, onCancel, onDelete, provided, snapshot }) => {
  const [editedTitle, setEditedTitle] = useState(ticket.title);
  const [editedDescription, setEditedDescription] = useState(ticket.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...ticket,
      title: editedTitle,
      description: editedDescription
    });
  };

  // Empêcher la propagation du double-clic lors du clic sur le bouton de suppression
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(ticket.id);
  };

  if (isEditing) {
    return (
      <Ticket
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        isDragging={snapshot.isDragging}
      >
        <DeleteButton onClick={handleDeleteClick} type="button" />
        <EditForm onSubmit={handleSubmit}>
          <EditInput
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Titre du ticket"
            autoFocus
          />
          <EditTextarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description"
          />
          <ButtonGroup>
            <Button type="submit">Enregistrer</Button>
            <Button type="button" variant="cancel" onClick={onCancel}>
              Annuler
            </Button>
          </ButtonGroup>
        </EditForm>
      </Ticket>
    );
  }

  return (
    <Ticket
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      isDragging={snapshot.isDragging}
    >
      <DeleteButton onClick={handleDeleteClick} type="button" />
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
    </Ticket>
  );
};

const initialTickets = [
  { id: 'ticket-1', title: 'Corriger le bug #123', description: 'Bug critique sur la page d\'accueil', status: 'todo' },
  { id: 'ticket-2', title: 'Mettre à jour la documentation', description: 'Documentation API REST', status: 'todo' },
  { id: 'ticket-3', title: 'Optimiser les performances', description: 'Améliorer le temps de chargement', status: 'en cours' },
  { id: 'ticket-4', title: 'Tests unitaires', description: 'Écrire les tests pour le module auth', status: 'terminé' },
];

function TicketBoard() {
  const [tickets, setTickets] = useState(initialTickets);
  const [editingTicketId, setEditingTicketId] = useState(null);
  
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const ticketToMove = tickets.find(t => t.id === draggableId);
    const newTickets = tickets.filter(t => t.id !== draggableId);
    
    const updatedTicket = {
      ...ticketToMove,
      status: destination.droppableId
    };
    
    const destinationTickets = newTickets.filter(t => t.status === destination.droppableId);
    destinationTickets.splice(destination.index, 0, updatedTicket);
    
    const finalTickets = [
      ...newTickets.filter(t => t.status !== destination.droppableId),
      ...destinationTickets
    ];
    
    setTickets(finalTickets);
  };

  const addNewTicket = () => {
    const newTicket = {
      id: `ticket-${Date.now()}`,
      title: 'Nouveau ticket',
      description: 'Double-cliquez pour éditer',
      status: 'todo'
    };
    setTickets([...tickets, newTicket]);
  };

  const handleDoubleClick = (ticketId) => {
    if (!editingTicketId) {
      setEditingTicketId(ticketId);
    }
  };

  const handleSave = (updatedTicket) => {
    setTickets(tickets.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
    setEditingTicketId(null);
  };

  const handleCancel = () => {
    setEditingTicketId(null);
  };

  // Nouvelle fonction pour gérer la suppression
  const handleDelete = (ticketId) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    if (editingTicketId === ticketId) {
      setEditingTicketId(null);
    }
  };

  const columns = ['todo', 'en cours', 'terminé'];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container>
        <BoardHeader>
          <BoardTitle>Tableau des tickets</BoardTitle>
          <AddButton onClick={addNewTicket}>
            + Ajouter un ticket
          </AddButton>
        </BoardHeader>
        
        <ColumnContainer>
          {columns.map(status => (
            <Column key={status}>
              <ColumnHeader>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </ColumnHeader>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <TicketList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                  >
                    {tickets
                      .filter(ticket => ticket.status === status)
                      .map((ticket, index) => (
                        <Draggable 
                          key={ticket.id} 
                          draggableId={ticket.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div onDoubleClick={() => handleDoubleClick(ticket.id)}>
                              <EditableTicket
                                ticket={ticket}
                                isEditing={editingTicketId === ticket.id}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                                provided={provided}
                                snapshot={snapshot}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </TicketList>
                )}
              </Droppable>
            </Column>
          ))}
        </ColumnContainer>
      </Container>
    </DragDropContext>
  );
}

export default TicketBoard;