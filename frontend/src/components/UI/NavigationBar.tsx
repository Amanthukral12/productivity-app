import useAuthStore from "../../store/authStore";
import { NavLink } from "react-router-dom";
import { IoMdPerson } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import image from "../../assets/productivity.webp";
import { MdEvent } from "react-icons/md";
const NavigationBar = () => {
  const { user } = useAuthStore();
  return (
    <div className="hidden bg-main m-3 min-h-[97vh] p-2.5 rounded-2xl lg:flex lg:flex-col items-center z-10 shadow-2xl text-white">
      <div className="flex flex-col justify-center items-center my-7">
        <img src={image} alt="" className="w-2/5 h-1/2 rounded-3xl" />
        <h1 className="text-lg lg:text-2xl mt-4 font-bold text-white">
          Produkto
        </h1>
      </div>
      <hr className="w-[90%] border-t-2 border-white mb-4" />
      <NavLink
        className={({ isActive }) =>
          `p-2.5 w-[90%] text-lg font-bold flex items-center mb-1 ${
            isActive ? "bg-white !text-main rounded-2xl !shadow-lg" : ""
          }`
        }
        to="/"
      >
        <FaHome className="h-8 w-8 mr-2.5" />
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `p-2.5 w-[90%] text-lg font-bold flex items-center mb-1 ${
            isActive ? "bg-white !text-main rounded-2xl !shadow-lg" : ""
          }`
        }
        to="/todo"
      >
        <LuListTodo className="h-8 w-8 mr-2.5" />
        Todo List
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `p-2.5 w-[90%] text-lg font-bold flex items-center mb-1 ${
            isActive ? "bg-white !text-main rounded-2xl !shadow-lg" : ""
          }`
        }
        to="/notes"
      >
        <FaNoteSticky className="h-8 w-8 mr-2.5" />
        Notes App
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `p-2.5 w-[90%] text-lg font-bold flex items-center mb-1 ${
            isActive ? "bg-white !text-main rounded-2xl !shadow-lg" : ""
          }`
        }
        to="/event-reminder"
      >
        <MdEvent className="h-8 w-8 mr-2.5" />
        Event Reminder
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `p-2.5 w-[90%] text-lg font-bold flex items-center mb-1 ${
            isActive ? "bg-white !text-main rounded-2xl !shadow-2xl" : ""
          }`
        }
        to="/profile"
      >
        <IoMdPerson className="h-8 w-8 mr-2.5" />
        Profile
      </NavLink>
      <div className="flex items-center mt-auto mr-auto mb-4">
        <img
          src={user?.avatar || undefined}
          className="rounded-full h-16 w-16 mr-3"
          alt=""
        />
        <h2 className="text-xl text-white font-bold cursor-pointer">
          {user?.name}
        </h2>
      </div>
    </div>
  );
};

export default NavigationBar;
