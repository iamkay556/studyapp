import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskBoard = () => {
    const [columns, setColumns] = useState({
        todo: [
            { id: "task-1", content: "Task 1" },
            { id: "task-2", content: "Task 2" },
        ],
        inProgress: [
            { id: "task-3", content: "Task 3" }
        ],
        done: [
            { id: "task-4", content: "Task 4" }
        ],
    });

    const [newColumnName, setNewColumnName] = useState("");

    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) return; // if no shift, do nothing

        const sourceColumn = [...columns[source.droppableId]];
        const destColumn = [...columns[destination.droppableId]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        destColumn.splice(destination.index, 0, movedTask); // remove task from original column

        setColumns({
            ...columns, // keep cols unchanged
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn,
        });
    };

    const handleTaskChange = (columnId, taskId, newContent) => {
        setColumns({
            ...columns,
            [columnId]: columns[columnId].map((task) => // updates task
                task.id === taskId ? { ...task, content: newContent } : task
            ),
        });
    };

    const addTask = (columnId, content) => {
        if (content) {
            setColumns({
                ...columns,
                [columnId]: [ // adds to 1 column
                    ...columns[columnId],
                    { id: Date.now().toString(), content }, // random id
                ],
            });
        }
    };

    const addColumn = () => {
        if (newColumnName.trim()) {
            setColumns({
                ...columns,
                [newColumnName]: [],
            });
            setNewColumnName("");
        }
    };

    return (
        <div className="task-board-container">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board">
                    {Object.entries(columns).map(([columnId, tasks]) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="column"
                                >
                                    <h2 className="column-title">{columnId}</h2>
                                    {tasks.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="task"
                                                >
                                                    <input
                                                        type="text"
                                                        value={task.content}
                                                        onChange={(e) =>
                                                            handleTaskChange(
                                                                columnId,
                                                                task.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="task-input"
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <div className="add-task">
                                        <input
                                            type="text"
                                            placeholder="Add task..."
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    addTask(
                                                        columnId,
                                                        e.target.value
                                                    );
                                                    e.target.value = "";
                                                }
                                            }}
                                            className="add-task-input"
                                        />
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                    <div className="add-column">
                        <input
                            type="text"
                            placeholder="New column name..."
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="add-column-input"
                        />
                        <button onClick={addColumn} className="add-column-button">
                            Add Column
                        </button>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default TaskBoard;
