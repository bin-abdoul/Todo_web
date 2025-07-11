import React from "react";
import "./styles.css";
import { Calendar, Check, Edit2, Plus, Star, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { useViewTodoQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation} from "@/api/requests/todo.requests"
export default function Todo() {
  interface Todo{
    text: string,
    completed: boolean,
    _id: string,
  }
  const {  data:todos =[], isLoading, isError } = useViewTodoQuery();
  const [update] = useUpdateTodoMutation();
  const [AddTodo] = useAddTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  
  const [activebtn, setActivebtn] = React.useState("All");
  const [editId, setEditId] = React.useState("");
  const [editText, setEditText] = React.useState<string>("");

  const filteredTodos: Todo[] = todos.filter((todo) => {
    if (activebtn == "Active") return !todo.completed;
    if (activebtn == "Completed") return todo.completed;
    return true;
  });
  const [value, setValue] = React.useState("");
  const completedTodo = todos.filter((todo) => todo.completed);
  const infoBoardDatas = [
    todos.length,
    completedTodo.length,
    todos.length - completedTodo.length,
  ];
  const infoBoard = [
    [
      <Calendar color="blue" />,
      infoBoardDatas[0],
      "Total Tasks",
      "bg-blue-100",
    ],
    [<Check color="green" />, infoBoardDatas[1], "Completed", "bg-green-100"],
    [
      <Star color="orangered" fill="orangered" />,
      infoBoardDatas[2],
      "Remaining",
      "bg-red-100",
    ],
  ];
  const addTodo = async () => {
    if (value.trim()) {
      try {
        await AddTodo({
          text: value.trim(),
          completed: false,
        }).unwrap()
        setValue("")
      } catch (error) {
        console.log("Failed",error);
        
      }
    }
  };
  const saveEdit = async(todo: Todo) => {
    if(editText.trim()){
      try {
        await update({
          _id: todo._id,
          text: editText,
          completed: todo.completed
          
        }).unwrap()
        setEditId("");
      } catch (error) {
        console.log("Failed to update", error);
      }
    }
  };
  const Trash = async (todoId: string) => {
   try {
    await deleteTodo({
      _id: todoId
    }).unwrap()
   } catch (error) {
    console.log("Failed to delete", error);
   }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}></div>
          </div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 via-blue-600 bg-clip-text text-transparent mb-2">
            Loading Your Todos
          </h2>
          <p className="text-gray-500">Please wait while we fetch your tasks...</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load your todos right now. Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className=" min-h-screen bg-gradient-to-br from bg-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold bg-gradient-to-r from-purple-600 via-blue-600 bg-clip-text text-transparent mb-4">
            ✨ My Todo App
          </h1>
          <p className="text-gray-400">Organize your life with ease</p>
        </div>
        {/* Input area */}
        <div className="flex bg-white justify-around rounded-3xl p-6 shadow-lg gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={(e) => e.key == "Enter" && addTodo()}
            placeholder="What needs to be done?"
            className="border-2 flex-1 py-2 px-4 border-gray-200 focus:border-blue-500 duration-200 text-gray-700 rounded-lg focus:outline-none"
          />
          <button
            onClick={addTodo}
            className="flex text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 duration-200 hover:scale-105 rounded-lg py-2 px-4"
          >
            <Plus />
            Add
          </button>
        </div>
        {/* Mode buttons */}
        <div className="flex gap-3 my-4">
          {["All", "Active", "Completed"].map((mode) => {
            return (
              <button
                onClick={() => setActivebtn(mode)}
                key={mode}
                className={`${
                  mode == activebtn ? "bg-blue-400 text-white" : "bg-white"
                } text-gray-500 font-semibold px-4 py-2 rounded-lg`}
              >
                {mode}
              </button>
            );
          })}
        </div>
        {/* Info board */}
        <div className="grid grid-cols-3 gap-3 my-8">
          {infoBoard.map((index) => {
            return (
              <div
                key={infoBoard.indexOf(index)}
                className="bg-white rounded-lg flex gap-4 shadow-lg p-4 "
              >
                <div
                  className={`my-auto size-10 p-auto flex items-center justify-center rounded-lg ${index[3]}`}
                >
                  {index[0]}
                </div>
                <div className="">
                  <p className="font-bold text-xl text-gray-700">{index[1]}</p>
                  <p className="text-gray-500">{index[2]}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Todos List */}

        <div className="flex flex-col gap-3">
          {filteredTodos.map((item) => {
            return (
              <div
                key={todos.indexOf(item)}
                className="rounded-lg shadow-lg gap-5 px-5 py-3 bg-white flex"
              >
                <button
                  onClick={async () => {
                    try {
                      await update({
                        _id: item._id,
                        text: item.text,
                        completed: !item.completed,
                      }).unwrap()
                    } catch (error) {
                      console.log("Failed to update", error);
                    }
                  }}
                  className={`${
                    item.completed && "bg-green-400 border-green-400"
                  } hover:border-green-400 rounded-full border-gray-400 border-2 size-6`}
                >
                  {item.completed && <Check color="white" size={18} />}
                </button>
                <div className="flex flex-1 ">
                  {editId == item._id ? (
                    <div className="flex gap-3 flex-1">
                      <input
                        type="text"
                        className="flex-1 border-2 px-3 border-blue-600 rounded-lg"
                        autoFocus
                        onKeyPress={(e) => e.key == "Enter" && saveEdit(item)}
                        defaultValue={item.text}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <button
                        onClick={() => saveEdit(item)}
                        className="rounded-lg text-gray-800 bg-green-400 hover:bg-green-500 p-2 duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditId("");
                        }}
                        className="rounded-lg text-gray-800 bg-gray-400 hover:bg-gray-500 transform p-2 duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-1">
                      <p
                        className={`flex-1 ${item.completed && "line-through"}`}
                      >
                        {item.text}
                      </p>
                      <div>
                        <button
                          onClick={() => setEditId(item._id)}
                          className="rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-100 p-2 duration-200"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => Trash(item._id)}
                          className="rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 p-2 duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {filteredTodos.length == 0 && (
          <div className="text-center mt-10">
            <p className="text-center text-6xl my-4">📝</p>
            <p className="text-gray-600 font-semibold text-lg">
              {activebtn == "Completed"
                ? "No Completed Tasks"
                : activebtn == "Active"
                ? "No Active Tasks"
                : "No task yet"}
            </p>
            <p className="text-gray-600 font-semibold text-lg">
              {activebtn == "All" && "Try adding some tasks"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
