import { api } from "./api";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

export const todoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addTodo: builder.mutation<
      unknown,
      {
        text: string;
        completed: boolean;
      }
    >({
      query: (credentials) => ({
        url: "/todo/add-todo",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Todo"],
    }),
    viewTodo: builder.query<Todo[], void>({
      query: () => ({
        url: "/todo/todo-list",
        method: "GET",
      }),
      transformResponse: (response: any) => {

        return response.data.map((todo: any) => ({
          ...todo,
          _id: todo._id.toString()
        }));
      },
      providesTags: ["Todo"],
    }),
    updateTodo: builder.mutation<
      unknown,
      {
        _id: string;
        text: string;
        completed: boolean;
      }
    >({
      query: (credentials) => ({
        url: "/todo/edit-todo",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation<
      unknown,
      {
        _id: string;
      }
    >({
      query: (Credential) => ({
        url: "/todo/delete-todo",
        method: "DELETE",
        body: Credential,
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useViewTodoQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi
