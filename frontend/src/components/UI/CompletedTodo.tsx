import { FaRegCircle } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Todo } from "../../types/types";

const CompletedTodo = ({ completedTodos }: { completedTodos: Todo[] }) => {
  return (
    <div className="shadow-md p-2">
      <h2 className="text-lg font-bold text-main mb-2 flex items-center">
        <LuClipboardCheck className="mr-2 h-6 w-6 text-gray-500" />
        Completed Todos
      </h2>
      <div className="overflow-y-auto max-h-[40vh]">
        {completedTodos.length > 0 ? (
          completedTodos.map((todo: Todo) => (
            <div
              key={todo.id}
              className="p-4 rounded-lg mb-2 md:mx-5 flex border border-[#c3c5ca]"
            >
              <FaRegCircle className="mr-3 mt-1 h-4 w-4 text-green" />
              <div>
                <p className="font-medium">{todo.title}</p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="text-green">
                    {todo.isComplete ? "Completed" : ""}
                  </span>
                </p>
              </div>
              <MdOutlineDeleteOutline className="h-6 w-6 cursor-pointer ml-auto my-auto" />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No completed todos.</p>
        )}
      </div>
    </div>
  );
};

export default CompletedTodo;
