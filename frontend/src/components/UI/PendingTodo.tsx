import { format } from "date-fns";
import { FaRegCircle } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Todo } from "../../types/types";
import { useTodos } from "../../hooks/todos";
import { useTodoStore } from "../../store/todoStore";

const PendingTodo = ({ pendingTodos }: { pendingTodos: Todo[] }) => {
  const { updateTodoMutation, deleteTodoMutation } = useTodos();
  const { isReminderEnabled, priority, dueDateSort } = useTodoStore();
  const handleMarkComplete = (todoId: number) => {
    updateTodoMutation.mutate({
      todoId,
      formData: { isComplete: true },
    });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodoMutation.mutate(todoId);
  };

  const filteredTodos = isReminderEnabled
    ? pendingTodos.filter((todo) => todo.hasReminder)
    : pendingTodos;

  const finalSortedTodos = [...filteredTodos].sort((a, b) => {
    if (priority === "HIGH" || priority === "LOW") {
      if (a.priority !== b.priority) {
        if (priority === "HIGH") return a.priority === "HIGH" ? -1 : 1;
        if (priority === "LOW") return a.priority === "LOW" ? -1 : 1;
      }
    }

    if (dueDateSort === "asc") {
      return (
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
      );
    } else if (dueDateSort === "desc") {
      return (
        new Date(b.dueDate ?? 0).getTime() - new Date(a.dueDate ?? 0).getTime()
      );
    }

    return 0;
  });

  return (
    <div className="shadow-md p-2">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-bold text-main mb-2 flex items-center">
          <LuClipboardList className="mr-2 h-6 w-6 text-gray-500" />
          Pending Todos
        </h2>

        <button className="bg-main text-white py-1 px-4 rounded font-semibold cursor-pointer hover:scale-105 transition">
          <IoMdAdd className="inline mr-2 h-5 w-5" />
          Add New Todo
        </button>
      </div>

      <div className="overflow-y-auto min-h-[72vh] max-h-[72vh]">
        {finalSortedTodos.length > 0 ? (
          finalSortedTodos.map((todo: Todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-lg mb-2 md:mx-5 flex  ${
                todo.dueDate && new Date(todo.dueDate) < new Date()
                  ? "border-2 border-red-500"
                  : "border border-[#c3c5ca]"
              }`}
            >
              <FaRegCircle
                className="mr-3 mt-1 h-4 w-4 text-green cursor-pointer hover:scale-110 transition"
                onClick={() => handleMarkComplete(todo.id)}
              />
              <div className="w-4/5">
                <p
                  className={`font-medium mb-2 ${
                    todo.dueDate && new Date(todo.dueDate) < new Date()
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {todo.title}
                </p>

                <p className="text-sm">Priority: {todo.priority}</p>
                <div className="flex text-xs justify-between">
                  <p>
                    Due Date:{" "}
                    {todo.dueDate
                      ? format(new Date(todo.dueDate), "dd/MM/yyyy")
                      : "No due date"}
                  </p>

                  {todo.hasReminder && (
                    <p>
                      Reminder at:{" "}
                      {todo.reminderAt
                        ? format(new Date(todo.reminderAt), "dd/MM/yyyy HH:mm")
                        : "No reminder set"}
                    </p>
                  )}
                </div>
              </div>
              <MdOutlineDeleteOutline
                className="h-6 w-6 cursor-pointer ml-auto my-auto hover:scale-110 transition"
                onClick={() => handleDeleteTodo(todo.id)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pending todos.</p>
        )}
      </div>
    </div>
  );
};

export default PendingTodo;
