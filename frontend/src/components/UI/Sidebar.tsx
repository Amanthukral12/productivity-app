import { NavLink } from "react-router-dom";
import image from "../../assets/productivity.webp";
import { FaHome } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import useAuthStore from "../../store/authStore";
import { LuListTodo } from "react-icons/lu";
import { FaNoteSticky } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
const Sidebar = ({ shown, close }: { shown: boolean; close: () => void }) => {
  const { user } = useAuthStore();

  return (
    <div
      className={`
        fixed top-0 bottom-0 left-0 right-0 z-40
        transition-opacity duration-200 ease-in-out
        ${
          shown
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
      onClick={close}
    >
      <div
        className={`
          bg-main absolute top-0 left-0 w-3/5 min-h-screen p-2 rounded-lg
          flex flex-col items-center backdrop:blur-sm text-white
          transform transition-transform duration-200 ease-in-out
          ${shown ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center items-center my-7">
          <img src={image} alt="" className="w-2/5 h-1/2 rounded-3xl" />
          <h1 className="text-lg lg:text-2xl mt-4 font-bold text-white">
            Produkto
          </h1>
        </div>

        <hr className="w-[90%] border-t-2 border-white mb-4" />

        <NavLink to="/" className={navClass}>
          <FaHome className="h-8 w-8 mr-2.5" /> Home
        </NavLink>
        <NavLink to="/todo" className={navClass}>
          <LuListTodo className="h-8 w-8 mr-2.5" /> Todo List
        </NavLink>
        <NavLink to="/notes" className={navClass}>
          <FaNoteSticky className="h-8 w-8 mr-2.5" /> Notes App
        </NavLink>
        <NavLink to="/event-reminder" className={navClass}>
          <MdEvent className="h-8 w-8 mr-2.5" /> Event Reminder
        </NavLink>
        <NavLink to="/profile" className={navClass}>
          <IoMdPerson className="h-8 w-8 mr-2.5" /> Profile
        </NavLink>

        <div className="flex items-center mt-auto mr-auto mb-4">
          <img
            src={user?.avatar || undefined}
            className="rounded-full h-12 w-12 mr-4"
            alt=""
          />
          <h2 className="text-md text-main font-bold cursor-pointer">
            {user?.name}
          </h2>
        </div>
      </div>
    </div>
  );
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  `p-2.5 w-[90%] text-sm md:text-lg font-bold flex items-center mb-1 ${
    isActive ? "bg-white !text-main rounded-2xl !shadow-lg" : ""
  }`;

export default Sidebar;
