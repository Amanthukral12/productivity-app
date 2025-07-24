import { IoMenu } from "react-icons/io5";
import Sidebar from "../../components/UI/Sidebar";
import { useTodos } from "../../hooks/todos";
import { useState } from "react";
import NavigationBar from "../../components/UI/NavigationBar";
import TodoStats from "../../components/UI/TodoStats";
import FilterBar from "../../components/UI/FilterBar";
import { Todo as TodoType } from "../../types/types";
import PendingTodo from "../../components/UI/PendingTodo";
import CompletedTodo from "../../components/UI/CompletedTodo";
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

            <PendingTodo pendingTodos={pendingTodos} />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4 mt-4">
            <div className="hidden md:block">
              <TodoStats todos={todos} />
            </div>

            <CompletedTodo completedTodos={completedTodos} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Todo;
