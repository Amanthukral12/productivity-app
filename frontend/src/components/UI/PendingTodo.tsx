import { format } from "date-fns";
import { FaRegCircle } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Todo } from "../../types/types";

const PendingTodo = ({ pendingTodos }: { pendingTodos: Todo[] }) => {
  return (
    <div className="shadow-md p-2">
      <h2 className="text-lg font-bold text-main mb-2 flex items-center">
        <LuClipboardList className="mr-2 h-6 w-6 text-gray-500" />
        Pending Todos
      </h2>
      <div className="overflow-y-auto min-h-[72vh] max-h-[72vh]">
        {pendingTodos.length > 0 ? (
          pendingTodos.map((todo: Todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-lg mb-2 md:mx-5 flex  ${
                todo.dueDate && new Date(todo.dueDate) < new Date()
                  ? "border-2 border-red-500"
                  : "border border-[#c3c5ca]"
              }`}
            >
              <FaRegCircle className="mr-3 mt-1 h-4 w-4 text-green" />
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
                {todo.hasReminder && (
                  <div className="flex text-xs justify-between">
                    <p>
                      Due Date:{" "}
                      {todo.dueDate
                        ? format(new Date(todo.dueDate), "dd/MM/yyyy")
                        : "No due date"}
                    </p>
                    <p>
                      Reminder at:{" "}
                      {todo.reminderAt
                        ? format(new Date(todo.reminderAt), "dd/MM/yyyy HH:mm")
                        : "No reminder set"}
                    </p>
                  </div>
                )}
              </div>
              <MdOutlineDeleteOutline className="h-6 w-6 cursor-pointer ml-auto my-auto" />
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
