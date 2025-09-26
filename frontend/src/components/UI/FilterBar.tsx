import { useTodoStore } from "../../store/todoStore";

const FilterBar = () => {
  const {
    isReminderEnabled,
    setIsReminderEnabled,
    priority,
    setPriority,
    dueDateSort,
    setDueDateSort,
  } = useTodoStore();
  return (
    <div className="bg-[#ffffff] py-4 px-2 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold text-center">FilterBar</h2>
      <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:mx-8 mt-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isReminderEnabled"
            checked={!!isReminderEnabled}
            onChange={(e) => setIsReminderEnabled(e.target.checked)}
            className="accent-main h-4 w-4"
          />
          <label className="font-semibold">has Reminder?</label>
        </div>
        <div className="flex flex-col items-center space-x-2">
          <label htmlFor="priority" className="font-semibold">
            Sort by Priority:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="priority"
              id="low"
              value="LOW"
              checked={priority === "LOW"}
              onChange={(e) => setPriority(e.target.value)}
            />
            <label htmlFor="low">Low</label>
            <input
              type="radio"
              name="priority"
              id="high"
              value="HIGH"
              checked={priority === "HIGH"}
              onChange={(e) => setPriority(e.target.value)}
            />
            <label htmlFor="high">High</label>
          </div>
        </div>
        <div className="flex flex-col items-center space-x-2">
          <label htmlFor="dueDate" className="font-semibold">
            Sort by Due Date:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="dueDate"
              id="asc"
              value="asc"
              checked={dueDateSort === "asc"}
              onChange={(e) => setDueDateSort(e.target.value)}
            />
            <label htmlFor="low">Ascending</label>
            <input
              type="radio"
              name="dueDate"
              id="desc"
              value="desc"
              checked={dueDateSort === "desc"}
              onChange={(e) => setDueDateSort(e.target.value)}
            />
            <label htmlFor="high">Descending</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
