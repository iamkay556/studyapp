import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { db } from '../firebase';
import { collection, setDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TaskBoard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [columns, setColumns] = useState({
        // can add initial colunms here
    });
    const [newColumnName, setNewColumnName] = useState("");

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (currentUser) {
            const fetchTasks = async () => {
                const querySnapshot = await getDocs(collection(db, "tasks", currentUser.uid, "userTasks"));
                const userTasks = {};
                querySnapshot.forEach((doc) => {
                    userTasks[doc.id] = doc.data().tasks;
                });
                setColumns(userTasks);
            };

            fetchTasks();
        }
    }, [currentUser]);

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
            const sourceColumn = Array.from(columns[sourceColumnId]); // clone source column
            const destColumn = Array.from(columns[destColumnId]); // clone destination column
            const [movedTask] = sourceColumn.splice(source.index, 1);
            destColumn.splice(destination.index, 0, movedTask);

            setColumns({
                ...columns,
                [sourceColumnId]: sourceColumn,
                [destColumnId]: destColumn,
            });
        }
    };

    const handleTaskChange = async (columnId, taskId, newContent) => {
        if (!currentUser) return;

        const updatedTasks = columns[columnId].map((task) =>
            task.id === taskId ? { ...task, content: newContent } : task
        );

        await updateDoc(doc(db, "tasks", currentUser.uid, "userTasks", columnId), {
            tasks: updatedTasks,
        });

        setColumns({ ...columns, [columnId]: updatedTasks });
    };

    const addTask = async (columnId, content) => {
        if (!currentUser || !content.trim()) return;

        const task = { id: `task-${Date.now()}`, content };
        const updatedColumn = [...columns[columnId], task];

        await updateDoc(doc(db, "tasks", currentUser.uid, "userTasks", columnId), {
            tasks: updatedColumn,
        });

        setColumns({ ...columns, [columnId]: updatedColumn });
    };

    const deleteTask = async (columnId, taskId) => {
        if (!currentUser) return;

        const updatedTasks = columns[columnId].filter((task) => task.id !== taskId);

        await updateDoc(doc(db, "tasks", currentUser.uid, "userTasks", columnId), {
            tasks: updatedTasks,
        });

        setColumns({ ...columns, [columnId]: updatedTasks });
    };

    const addColumn = async () => {
        if (!currentUser || !newColumnName.trim()) return;

        await setDoc(doc(db, "tasks", currentUser.uid, "userTasks", newColumnName), { tasks: [] });
        setColumns({ ...columns, [newColumnName]: [] });
        setNewColumnName("");
    };

    const deleteColumn = async (columnId) => {
        if (!currentUser) return;

        await deleteDoc(doc(db, "tasks", currentUser.uid, "userTasks", columnId));
        const updatedColumns = { ...columns };
        delete updatedColumns[columnId];
        setColumns(updatedColumns);
    };

    return (
        <div className="task-board-container">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board">
                    {Object.entries(columns).map(([columnId, tasks]) => (
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
                                    {tasks.map((task, index) => ( {/* iterate tasks n make them draggable objects*/ },
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