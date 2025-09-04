import { useState, useRef } from 'react';
import { Plus, MoreHorizontal, Calendar, User, Clock, Edit3, Trash2, Users, Filter, Search } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  assignee?: {
    name: string;
    avatar: string;
    initials: string;
  };
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-[#7E47B8]/10 border-[#7E47B8]/20',
    tasks: [
      {
        id: '1',
        title: 'Setup Database Schema',
        description: 'Membuat struktur database untuk aplikasi notes',
        deadline: '2024-01-15',
        assignee: {
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          initials: 'JD'
        },
        priority: 'high',
        tags: ['Backend', 'Database']
      },
      {
        id: '2',
        title: 'Design UI Components',
        description: 'Membuat komponen reusable untuk interface',
        deadline: '2024-01-18',
        priority: 'medium',
        tags: ['Frontend', 'Design']
      }
    ]
  },
  {
    id: 'progress',
    title: 'In Progress',
    color: 'bg-blue-500/10 border-blue-500/20',
    tasks: [
      {
        id: '3',
        title: 'Implement Authentication',
        description: 'Setup login dan register dengan JWT',
        deadline: '2024-01-20',
        assignee: {
          name: 'Jane Smith',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150&h=150&fit=crop&crop=face',
          initials: 'JS'
        },
        priority: 'high',
        tags: ['Backend', 'Security']
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-500/10 border-green-500/20',
    tasks: [
      {
        id: '4',
        title: 'Project Setup',
        description: 'Initialize project dengan React dan dependencies',
        assignee: {
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          initials: 'JD'
        },
        priority: 'medium',
        tags: ['Setup', 'Project']
      },
      {
        id: '5',
        title: 'Research & Planning',
        description: 'Analisis requirements dan planning architecture',
        priority: 'low',
        tags: ['Research', 'Planning']
      }
    ]
  }
];

// Task Item Component with Drag and Drop
interface TaskItemProps {
  task: Task;
  columnId: string;
  onDelete: (taskId: string, columnId: string) => void;
  onEdit: (task: Task) => void;
}

function TaskItem({ task, columnId, onDelete, onEdit }: TaskItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, task, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Terlambat';
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Besok';
    return `${diffDays} hari lagi`;
  };

  return (
    <Card 
      ref={drag}
      className={`cursor-move hover:shadow-lg transition-all duration-200 bg-[#1E1E2E] border-[#333344] hover:border-[#7E47B8]/50 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm text-white">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1E1E2E] border-[#333344]">
              <DropdownMenuItem 
                onClick={() => onEdit(task)}
                className="text-gray-300 hover:text-white hover:bg-[#333344]"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id, columnId)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-400 mb-3">{task.description}</p>
        
        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-[#7E47B8]/10 text-[#7E47B8] border-[#7E47B8]/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Priority & Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.deadline && (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span className={formatDeadline(task.deadline) === 'Terlambat' ? 'text-red-400' : ''}>
                  {formatDeadline(task.deadline)}
                </span>
              </div>
            )}
          </div>
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-xs bg-[#7E47B8] text-white">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Column Component with Drop Zone
interface ColumnProps {
  column: Column;
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string) => void;
  onAddTask: (columnId: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onEditTask: (task: Task) => void;
  isAddingTask: boolean;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskDescription: string;
  setNewTaskDescription: (desc: string) => void;
  newTaskPriority: string;
  setNewTaskPriority: (priority: string) => void;
  setIsAddingTask: (state: string | null) => void;
}

function KanbanColumn({ 
  column, 
  onTaskMove, 
  onAddTask, 
  onDeleteTask, 
  onEditTask,
  isAddingTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  newTaskPriority,
  setNewTaskPriority,
  setIsAddingTask
}: ColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string; task: Task; columnId: string }) => {
      if (item.columnId !== column.id) {
        onTaskMove(item.id, item.columnId, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`min-w-[320px] bg-[#1E1E2E] rounded-lg border border-[#333344] transition-all duration-200 ${
        isOver ? 'border-[#7E47B8] bg-[#7E47B8]/5' : ''
      }`}
    >
      {/* Column Header */}
      <div className={`p-4 ${column.color} rounded-t-lg border-b border-[#333344]`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{column.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#333344] text-gray-300">
              {column.tasks.length}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsAddingTask(column.id)}
              className="text-gray-400 hover:text-white hover:bg-[#333344]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-3 min-h-[200px]">
        {column.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            columnId={column.id}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        ))}

        {/* Add Task Form */}
        {isAddingTask && (
          <Card className="border-dashed border-[#7E47B8]/50 bg-[#7E47B8]/5">
            <CardContent className="p-3">
              <Input
                placeholder="Judul tugas..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mb-2 bg-[#121212] border-[#333344] text-white placeholder:text-gray-500"
              />
              <Textarea
                placeholder="Deskripsi tugas..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="mb-2 bg-[#121212] border-[#333344] text-white placeholder:text-gray-500"
                rows={2}
              />
              <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                <SelectTrigger className="mb-3 bg-[#121212] border-[#333344] text-white">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E2E] border-[#333344]">
                  <SelectItem value="low" className="text-green-400">Low Priority</SelectItem>
                  <SelectItem value="medium" className="text-yellow-400">Medium Priority</SelectItem>
                  <SelectItem value="high" className="text-red-400">High Priority</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onAddTask(column.id)}
                  className="bg-[#7E47B8] hover:bg-[#6A3A9A] text-white"
                >
                  Tambah
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsAddingTask(null)}
                  className="border-[#333344] text-gray-300 hover:text-white hover:bg-[#333344]"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string) => {
    setColumns(prevColumns => {
      const task = prevColumns
        .find(col => col.id === fromColumnId)
        ?.tasks.find(t => t.id === taskId);

      if (!task) return prevColumns;

      return prevColumns.map(column => {
        if (column.id === fromColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter(t => t.id !== taskId)
          };
        }
        if (column.id === toColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, task]
          };
        }
        return column;
      });
    });
  };

  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority as 'low' | 'medium' | 'high',
      tags: []
    };

    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );

    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setIsAddingTask(null);
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
          : column
      )
    );
  };

  const updateTask = (updatedTask: Task) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      }))
    );
  };

  // Filter tasks based on search and priority
  const getFilteredColumns = () => {
    return columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesSearch && matchesPriority;
      })
    }));
  };

  const filteredColumns = getFilteredColumns();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 h-full bg-[#121212] text-white">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white">Manajemen Tugas</h1>
          <p className="text-gray-400">Kelola tugas Anda dengan Kanban board</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari tugas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1E1E2E] border-[#333344] text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px] bg-[#1E1E2E] border-[#333344] text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter prioritas" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E2E] border-[#333344]">
                <SelectItem value="all" className="text-gray-300">Semua Prioritas</SelectItem>
                <SelectItem value="high" className="text-red-400">High Priority</SelectItem>
                <SelectItem value="medium" className="text-yellow-400">Medium Priority</SelectItem>
                <SelectItem value="low" className="text-green-400">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#1E1E2E] border-[#333344]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#7E47B8]/20 rounded-lg">
                  <Clock className="w-5 h-5 text-[#7E47B8]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Tugas</p>
                  <p className="text-2xl font-bold text-white">
                    {columns.reduce((total, column) => total + column.tasks.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1E1E2E] border-[#333344]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {columns.find(c => c.id === 'progress')?.tasks.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1E1E2E] border-[#333344]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Selesai</p>
                  <p className="text-2xl font-bold text-white">
                    {columns.find(c => c.id === 'done')?.tasks.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1E1E2E] border-[#333344]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Kolaborator</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {filteredColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onTaskMove={handleTaskMove}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onEditTask={setEditingTask}
              isAddingTask={isAddingTask === column.id}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskDescription={newTaskDescription}
              setNewTaskDescription={setNewTaskDescription}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              setIsAddingTask={setIsAddingTask}
            />
          ))}

          {/* Add New Column */}
          <div className="min-w-[320px]">
            <Button 
              variant="outline" 
              className="w-full h-12 border-dashed border-[#7E47B8]/50 text-[#7E47B8] hover:bg-[#7E47B8]/10 hover:text-[#7E47B8]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kolom
            </Button>
          </div>
        </div>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="bg-[#1E1E2E] border-[#333344] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Tugas</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title" className="text-gray-300">Judul</Label>
                  <Input 
                    id="edit-title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="bg-[#121212] border-[#333344] text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-gray-300">Deskripsi</Label>
                  <Textarea 
                    id="edit-description"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="bg-[#121212] border-[#333344] text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-priority" className="text-gray-300">Prioritas</Label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(value) => setEditingTask({
                      ...editingTask, 
                      priority: value as 'low' | 'medium' | 'high'
                    })}
                  >
                    <SelectTrigger className="bg-[#121212] border-[#333344] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E2E] border-[#333344]">
                      <SelectItem value="low" className="text-green-400">Low Priority</SelectItem>
                      <SelectItem value="medium" className="text-yellow-400">Medium Priority</SelectItem>
                      <SelectItem value="high" className="text-red-400">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      updateTask(editingTask);
                      setEditingTask(null);
                    }}
                    className="bg-[#7E47B8] hover:bg-[#6A3A9A] text-white"
                  >
                    Simpan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingTask(null)}
                    className="border-[#333344] text-gray-300 hover:text-white hover:bg-[#333344]"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}