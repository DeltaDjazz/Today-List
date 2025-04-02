import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styled from '@emotion/styled';
import { colors } from './colors';
import logo from './assets/img/logo1.png';
import alter from './assets/img/icons/alter.png';
import manger from './assets/img/icons/manger.png';
import crayon from './assets/img/icons/crayon.png';
import achat from './assets/img/icons/achat.png';
import call from './assets/img/icons/call.png';
import listen from './assets/img/icons/listen.png';
import see from './assets/img/icons/see.png';
import drink from './assets/img/icons/drink.png';
import note from './assets/img/icons/note.png';
import bgdegrade from './assets/img/bg-degrade-light80-1.webp';
import bggrid from './assets/img/bg-grid.svg';

// Les styles
const Container = styled.div`
  padding: 0px;
  background-color: #0c0637;
  background-image: url(${bgdegrade}), url(${bggrid});
  background-size: cover, cover; /* Les deux images couvrent toute la zone */
  background-position: center, center; /* Centrer les images */
  background-repeat: no-repeat, no-repeat; /* Empêcher la répétition des images */
  background-attachment: fixed; /* Fixer l'arrière-plan lors du défilement */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  display: flex;
  align-items: center; // Centre verticalement les éléments
  justify-content: center; // Centre horizontalement les éléments
  background: #0000004f;
  margin-bottom: 20px;
  padding: 0 0 10px;
  width: 100%;

`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
`;

const HeaderTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  padding: 10px;
  margin: 0;
`;

const Navigation = styled.nav`
  width: 100%;
  max-width: 1200px;
  margin: 10px 60px;
`;


const AddButton = styled.button`
  
  padding: 10px 20px;
  margin: 0px;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  position: relative;
  font-size: 16px;
  transition: all .2s ease-in-out;
  z-index: 10;
   &::before {
    content: "";
    position: absolute;
    inset: -3px; /* Dépasse légèrement pour créer un contour */
    border-radius: 0.5rem;
    background: linear-gradient(45deg, #00fff7, #ff00f7); /* Dégradé bleu → violet */
    z-index: -1; /* Derrière le bouton */
    padding: 3px; /* Épaisseur du contour */
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
  &:hover {
    z-index: 0;
    color: #fff;
    background: #1906ff3b;
  }
 
`;

const ColumnContainer = styled.main`
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 0px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 10.25%, rgba(255, 255, 255, 0.04) 96.75%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Fonction utilitaire pour déterminer la couleur en fonction du statut
const getColorByStatus = (status) => {
  switch (status) {
    case 'todo': return colors.yellow;
    case 'en cours': return colors.blue;
    case 'terminé': return colors.green;
    default: return 'white';
  }
};

const getColorDarkByStatus = (status) => {
  switch (status) {
    case 'todo': return colors.yellowDark;
    case 'en cours': return colors.blueDark;
    case 'terminé': return colors.greenDark;
    default: return 'white';
  }
};

const ColumnHeader = styled.h2`
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #000;
  color: ${props => getColorByStatus(props.status)};
  border-bottom-color: ${props => getColorByStatus(props.status)};
  font-size: 18px;
`;

const TicketList = styled.div`
  min-height: 100px;
  background: ${props => props.isDraggingOver ? '#f0f7ff42' : 'transparent'};
  transition: background-color 0.2s ease;
  border-radius: 5px;
  padding: 8px;
`;

const TicketContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TicketImage = styled.img`
  width: 40px;
  height: 40px;
  border: 3px solid #0002;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.14) 0px 3px 8px;
`;

const TicketText = styled.div`
  flex: 1;
`;

// Modification du style Ticket pour gérer le positionnement relatif
const Ticket = styled.div`
  position: relative;
  border-radius: 1px;
  padding: 15px;
  margin-bottom: 10px;
  background: ${props => getColorByStatus(props.status)};
  border-top: 4px solid ${props => getColorDarkByStatus(props.status)};;
  box-shadow: ${props => props.isDragging ? '0 5px 10px rgba(0, 0, 0, 0.15)' : '0 2px 3px rgba(0, 0, 0, 0.05)'};
  user-select: none;
  
  &:hover {
    background-color: ${props => {
      switch (props.status) {
        case 'todo': return colors.yellowLight;
        case 'en cours': return colors.blueLight;
        case 'terminé': return colors.greenLight;
        default: return '#f0f0f0';
      }
    }};
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
    color: #000;
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
  border: none;
  box-shadow: inset rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  font-size: 14px;
  width: 100%;
  &:focus-visible {
     outline: 2px solid #000;
  }
`;

const EditTextarea = styled.textarea`
  padding: 8px;
  border: none;
  box-shadow: inset rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  font-size: 14px;
  width: 100%;
  resize: vertical;
  min-height: 60px;
  &:focus-visible {
     outline: 2px solid #000;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 14px;
  background: ${props => props.variant === 'cancel' ? 'white' : 'black'};
  color: ${props => props.variant === 'cancel' ? '#333' : 'white'};

  &:hover {
    background: ${props => props.variant === 'cancel' ? '#e0e0e0' : '#1906ffaa'};
  }
`;

// Modification du composant EditableTicket pour inclure le bouton de suppression
const EditableTicket = ({ 
  ticket,
  isEditing,
  onSave,
  onCancel,
  onDelete,
  provided,
  snapshot
}) => {
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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(ticket.id);
  };

  const imageSrc = getImageForTicket(ticket.title);

  if (isEditing) {
    return (
      <Ticket
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        isDragging={snapshot.isDragging}
        status={ticket.status}
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
      status={ticket.status}
    >
      <DeleteButton onClick={handleDeleteClick} type="button" />
      <TicketContent>
        <TicketImage src={imageSrc} alt="Ticket icon" />
        <TicketText>
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
        </TicketText>
      </TicketContent>
    </Ticket>
  );
};

const initialTickets = [
  { id: 'ticket-1', title: 'Manger escalope à midi', description: 'Cuisiner une escalope de poulet dorée à la perfection, accompagnée d\'un mélange vibrant de légumes frais sautés à l\'huile d\'olive et aux herbes aromatiques', status: 'todo' },
  { id: 'ticket-2', title: 'Faire 100 pompes', description: 'Réaliser 5 séries de 20 répétitions', status: 'en cours' },
  { id: 'ticket-3', title: 'Dessiner un peu', description: 'Faire de  la perspective et de l\'observation', status: 'todo' },
  { id: 'ticket-4', title: 'Faire les courses', description: 'acheter : oeufs, avocats, carottes, liquide vaisselle', status: 'todo' },
];

const getImageForTicket = (title) => {
  if (title.match(/sport|pompes|abdos/i)) {
    return alter;
  } else if (title.match(/repas|cuisiner|manger/i)) {
    return manger;
  } else if (title.match(/lire|écrire|ecrire|dessin|code/i)) {
    return crayon;
  } else if (title.match(/acheter|course/i)) {
    return achat;
  } else if (title.match(/appel|telephone|téléphone/i)) {
    return call;
  } else if (title.match(/ecoute|écouter|poadcast|musique/i)) {
    return listen;
  } else if (title.match(/voir|regarder/i)) {
    return see;
  } else if (title.match(/boire|eau/i)) {
    return drink;
  } else {
    return note;
  }
};

function TicketBoard() {
  const [tickets, setTickets] = useState(initialTickets);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [newTicketId, setNewTicketId] = useState(null);
  
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
      title: '',
      description: '',
      status: 'todo'
    };
    const ticketsWithNewTicket = [...tickets, newTicket];
    setTickets(ticketsWithNewTicket);
    setEditingTicketId(newTicket.id);
    setNewTicketId(newTicket.id);
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
    setNewTicketId(null);
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

        <Header>
          <Logo src={logo} alt="Logo" /> 
          <HeaderTitle>Today-List</HeaderTitle>
        </Header>

        <Navigation>
          <AddButton onClick={addNewTicket}>
            + Ajouter une tache
          </AddButton>
        </Navigation>
        
        <ColumnContainer>
          {columns.map(status => (
            <Column key={status}>
              <ColumnHeader status={status}>
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