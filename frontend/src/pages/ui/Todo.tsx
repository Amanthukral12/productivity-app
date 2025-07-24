import { IoMenu } from "react-icons/io5";
import Sidebar from "../../components/UI/Sidebar";
import { useTodos } from "../../hooks/todos";
import { useState } from "react";
import NavigationBar from "../../components/UI/NavigationBar";
import TodoStats from "../../components/UI/TodoStats";
import FilterBar from "../../components/UI/FilterBar";
import { Todo as TodoType } from "../../types/types";
import { LuClipboardCheck } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { format } from "date-fns";
const Todo = () => {
  const { todosQuery } = useTodos();
  const [showSideBar, setShowSideBar] = useState(false);
  const todos = todosQuery.data || [];
  const pendingTodos = todos.filter((todo: TodoType) => !todo.isComplete);
  const completedTodos = todos.filter((todo: TodoType) => todo.isComplete);
  return (
    <div className="bg-[#F5F8FF] bg-cover min-h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row w-full ">
      <div className="w-0 lg:w-1/5 z-5">
        <NavigationBar />
      </div>
      <div className="w-full lg:hidden">
        <IoMenu
          onClick={() => setShowSideBar(true)}
          className={`flex lg:hidden h-8 w-8 ml-3 mt-2 text-main ${
            showSideBar ? "hidden" : ""
          }`}
        />
        <Sidebar
          shown={showSideBar}
          close={() => setShowSideBar(!showSideBar)}
        />
      </div>
      <section className="lg:w-4/5 h-full mx-3 mt-3 lg:mr-3 lg:mx-0 bg-[#F5F8FF] ">
        <FilterBar />

        <div className="flex flex-col md:flex-row gap-4 w-[95%] min-h-[85vh] rounded-sm my-4 px-4 mx-auto bg-[#F5F8FF] border border-[#c3c5ca] pb-4">
          <div className="w-full md:w-1/2 flex flex-col gap-4 mt-4">
            <div className="block md:hidden">
              <TodoStats todos={todos} />
            </div>

            <div className="shadow-md p-2">
              <h2 className="text-lg font-bold text-main mb-2 flex items-center">
                <LuClipboardList className="mr-2 h-6 w-6 text-gray-500" />
                Pending Todos
              </h2>
              <div className="overflow-y-auto min-h-[72vh] max-h-[72vh]">
                {pendingTodos.length > 0 ? (
                  pendingTodos.map((todo: TodoType) => (
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
                                ? format(
                                    new Date(todo.reminderAt),
                                    "dd/MM/yyyy HH:mm"
                                  )
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
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4 mt-4">
            <div className="hidden md:block">
              <TodoStats todos={todos} />
            </div>

            <div className="shadow-md p-2">
              <h2 className="text-lg font-bold text-main mb-2 flex items-center">
                <LuClipboardCheck className="mr-2 h-6 w-6 text-gray-500" />
                Completed Todos
              </h2>
              <div className="overflow-y-auto max-h-[40vh]">
                {completedTodos.length > 0 ? (
                  completedTodos.map((todo: TodoType) => (
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Todo;
