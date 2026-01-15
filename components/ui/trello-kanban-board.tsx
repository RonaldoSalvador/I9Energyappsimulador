"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// Types - exported for reusability
export interface KanbanTask {
    id: string
    title: string
    description?: string
    labels?: string[]
    assignee?: string
    phone?: string
    email?: string
}

export interface KanbanColumn {
    id: string
    title: string
    tasks: KanbanTask[]
}

export interface KanbanBoardProps {
    columns: KanbanColumn[]
    onColumnsChange?: (columns: KanbanColumn[]) => void
    onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string) => void
    onTaskAdd?: (columnId: string, title: string) => void
    labelColors?: Record<string, string>
    columnColors?: Record<string, string>
    className?: string
    allowAddTask?: boolean
    disableDrag?: boolean
}

const defaultLabelColors: Record<string, string> = {
    research: "bg-pink-500",
    design: "bg-violet-500",
    frontend: "bg-blue-500",
    backend: "bg-emerald-500",
    devops: "bg-amber-500",
    docs: "bg-slate-500",
    urgent: "bg-red-500",
}

const defaultColumnColors: Record<string, string> = {
    backlog: "bg-slate-500",
    todo: "bg-blue-500",
    "in-progress": "bg-amber-500",
    review: "bg-violet-500",
    done: "bg-emerald-500",
}

export function KanbanBoard({
    columns: initialColumns,
    onColumnsChange,
    onTaskMove,
    onTaskAdd,
    labelColors = defaultLabelColors,
    columnColors = defaultColumnColors,
    className,
    allowAddTask = true,
    disableDrag = false,
}: KanbanBoardProps) {
    const [columns, setColumns] = React.useState<KanbanColumn[]>(initialColumns)
    const [draggedTask, setDraggedTask] = React.useState<{
        task: KanbanTask
        sourceColumnId: string
    } | null>(null)
    const [dropTarget, setDropTarget] = React.useState<string | null>(null)
    const [addingCardTo, setAddingCardTo] = React.useState<string | null>(null)
    const [newCardTitle, setNewCardTitle] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Synchronize internal state with props if they change (e.g. data fetch)
    React.useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    React.useEffect(() => {
        if (addingCardTo && inputRef.current) {
            inputRef.current.focus()
        }
    }, [addingCardTo])

    const handleDragStart = (task: KanbanTask, columnId: string) => {
        setDraggedTask({ task, sourceColumnId: columnId })
    }

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault()
        setDropTarget(columnId)
    }

    const handleDrop = (targetColumnId: string) => {
        if (!draggedTask || draggedTask.sourceColumnId === targetColumnId) {
            setDraggedTask(null)
            setDropTarget(null)
            return
        }

        const newColumns = columns.map((col) => {
            if (col.id === draggedTask.sourceColumnId) {
                return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id) }
            }
            if (col.id === targetColumnId) {
                return { ...col, tasks: [...col.tasks, draggedTask.task] }
            }
            return col
        })

        setColumns(newColumns)
        onColumnsChange?.(newColumns)
        onTaskMove?.(draggedTask.task.id, draggedTask.sourceColumnId, targetColumnId)
        setDraggedTask(null)
        setDropTarget(null)
    }

    const handleAddCard = (columnId: string) => {
        if (!newCardTitle.trim()) return

        const newTask: KanbanTask = {
            id: `task-${Date.now()}`,
            title: newCardTitle.trim(),
            labels: [],
        }

        const newColumns = columns.map((col) => (col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col))

        setColumns(newColumns)
        onColumnsChange?.(newColumns)
        onTaskAdd?.(columnId, newCardTitle.trim())
        setNewCardTitle("")
        setAddingCardTo(null)
    }

    const getColumnColor = (columnId: string) => columnColors[columnId] || "bg-slate-500"
    const getLabelColor = (label: string) => labelColors[label] || "bg-slate-500"

    return (
        <div className={cn("flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x", className)}>
            {columns.map((column) => {
                const isDropActive = dropTarget === column.id && draggedTask?.sourceColumnId !== column.id

                return (
                    <div
                        key={column.id}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDrop={() => handleDrop(column.id)}
                        onDragLeave={() => setDropTarget(null)}
                        className={cn(
                            "min-w-[280px] max-w-[280px] rounded-xl p-3 transition-all duration-200 snap-center",
                            "bg-slate-800/50 border-2 backdrop-blur-sm",
                            isDropActive ? "border-energisa-orange/50 border-dashed bg-energisa-orange/5" : "border-transparent",
                        )}
                    >
                        {/* Column Header */}
                        <div className="mb-3 flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className={cn("h-3 w-3 rounded", getColumnColor(column.id))} />
                                <h2 className="text-sm font-semibold text-slate-100">{column.title}</h2>
                                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-300">
                                    {column.tasks.length}
                                </span>
                            </div>

                        </div>

                        {/* Tasks */}
                        <div className="flex min-h-[100px] flex-col gap-2">
                            {column.tasks.map((task) => {
                                const isDragging = draggedTask?.task.id === task.id

                                return (
                                    <div
                                        key={task.id}
                                        draggable={!disableDrag}
                                        onDragStart={() => !disableDrag && handleDragStart(task, column.id)}
                                        onDragEnd={() => setDraggedTask(null)}
                                        className={cn(
                                            "cursor-grab rounded-lg border border-white/5 bg-slate-700/50 p-3 shadow-sm transition-all duration-150",
                                            "hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing hover:bg-slate-700",
                                            isDragging && "rotate-2 opacity-50",
                                        )}
                                    >
                                        {task.labels && task.labels.length > 0 && (
                                            <div className="mb-2 flex flex-wrap gap-1">
                                                {task.labels.map((label) => (
                                                    <span
                                                        key={label}
                                                        className={cn(
                                                            "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white",
                                                            getLabelColor(label),
                                                        )}
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <h3 className={cn("text-sm font-medium text-slate-200", task.description && "mb-1")}>
                                            {task.title}
                                        </h3>

                                        {task.description && <p className="mb-2 text-xs text-slate-400">{task.description}</p>}

                                        {/* Contact Info */}
                                        {(task.phone || task.email) && (
                                            <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                                                {task.phone && (
                                                    <a
                                                        href={`https://wa.me/55${task.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1.5 text-[11px] text-green-400 hover:text-green-300 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                        {task.phone}
                                                    </a>
                                                )}
                                                {task.email && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate">
                                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="truncate">{task.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {task.assignee && (
                                            <div className="flex justify-end mt-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-energisa-orange/20 text-[11px] font-semibold text-energisa-orange border border-energisa-orange/30">
                                                    {task.assignee}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {/* Add Card */}
                            {allowAddTask && (
                                <>
                                    {addingCardTo === column.id ? (
                                        <div className="rounded-lg border border-white/10 bg-slate-800 p-3 shadow-sm">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={newCardTitle}
                                                onChange={(e) => setNewCardTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddCard(column.id)}
                                                placeholder="Título da tarefa..."
                                                className="mb-2 w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAddCard(column.id)}
                                                    className="rounded bg-energisa-orange px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-600"
                                                >
                                                    Adicionar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAddingCardTo(null)
                                                        setNewCardTitle("")
                                                    }}
                                                    className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                                    aria-label="Cancel"
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingCardTo(column.id)}
                                            className="flex w-full items-center justify-center gap-1 rounded-lg p-2 text-sm text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Adicionar Card
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
