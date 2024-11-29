import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskBoard = () => {
    const [columns, setColumns] = useState({
        // add columns here
    });

    const [newColumnName, setNewColumnName] = useState("");

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return; // if no drop, do nothing

        const sourceColumnId = source.droppableId;
        const destColumnId = destination.droppableId;

        if (sourceColumnId === destColumnId) {
            // moving in same column
            const column = Array.from(columns[sourceColumnId]); // clone column
            const [movedTask] = column.splice(source.index, 1); // remove task
            column.splice(destination.index, 0, movedTask); // add task

            setColumns({ // update column
                ...columns,
                [sourceColumnId]: column,
            });
        } else {
            // diff column
            const sourceColumn = Array.from(columns[sourceColumnId]); // same clone with 2 columns
            const destColumn = Array.from(columns[destColumnId]);
            const [movedTask] = sourceColumn.splice(source.index, 1);
            destColumn.splice(destination.index, 0, movedTask);

            setColumns({
                ...columns,
                [sourceColumnId]: sourceColumn,
                [destColumnId]: destColumn,
            });
        }
    };

    const handleTaskChange = (columnId, taskId, newContent) => {
        setColumns({
            ...columns,
            [columnId]: columns[columnId].map((task) =>
                task.id === taskId ? { ...task, content: newContent } : task // update content iff id match
            ),
        });
    };

    const addTask = (columnId, content) => {
        if (content.trim()) { // task content not empty
            setColumns({
                ...columns,
                [columnId]: [
                    ...columns[columnId],
                    { id: `task-${Date.now()}`, content },
                ],
            });
        }
    };

    const deleteTask = (columnId, taskId) => {
        setColumns({
            ...columns,
            [columnId]: columns[columnId].filter((task) => task.id !== taskId),
        });
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

    const deleteColumn = (columnId) => {
        const updatedColumns = { ...columns }; // clone and remove and update
        delete updatedColumns[columnId];
        setColumns(updatedColumns);
    };

    return (
        <div className="task-board-container">
            <DragDropContext onDragEnd={onDragEnd}> 
                <div className="board">
                    {Object.entries(columns).map(([columnId, tasks]) => ( {/* iterate columns n make them droppable areas*/},
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef} // add droppable ref
                                    {...provided.droppableProps} 
                                    className="column"
                                >
                                    <div className="column-header">
                                        <h2 className="column-title">{columnId}</h2> 
                                        <button
                                            className="delete-column-button"
                                            onClick={() => deleteColumn(columnId)}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                    {tasks.map((task, index) => ( {/* iterate tasks n make them draggable objects*/},
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
                                                    <button
                                                        className="delete-task-button"
                                                        onClick={() => deleteTask(columnId, task.id)}
                                                    >
                                                        ✖
                                                    </button>
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
                                                    addTask(columnId, e.target.value);
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