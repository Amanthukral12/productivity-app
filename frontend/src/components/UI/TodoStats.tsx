import { LuListTodo } from "react-icons/lu";
import { Todo } from "../../types/types";
import ProgressCircle from "./ProgressCircle";

const TodoStats = ({ todos }: { todos: Todo[] }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.isComplete).length;
  const pendingTodos = totalTodos - completedTodos;
  return (
    <div className="bg-[#F5F8FF] my-2 rounded-lg shadow p-2">
      <p className="text-lg text-main mb-0.5 flex items-center">
        <LuListTodo className="mr-2 h-6 w-6 text-gray-500" /> Todo Status
      </p>
      <div className="flex flex-row justify-around items-center ">
        <div className="flex flex-col justify-center items-center">
          <ProgressCircle
            progress={Math.round((completedTodos / totalTodos) * 100)}
            progressColor="var(--color-green)"
          />
          <span className="text-green font-semibold flex items-center ">
            <span className="text-3xl mr-2">•</span> Completed
          </span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <ProgressCircle
            progress={Math.round((pendingTodos / totalTodos) * 100)}
            progressColor="var(--color-blue-600)"
          />
          <span className="text-blue-600 font-semibold flex items-center">
            <span className="text-3xl mr-2">•</span> In-Progress
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;
