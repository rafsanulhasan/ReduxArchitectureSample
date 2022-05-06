using ReduxArchitecture.Application.Common.Mappings;
using ReduxArchitecture.Domain.Entities;

namespace ReduxArchitecture.Application.TodoLists.Queries.ExportTodos
{
    public class TodoItemRecord : IMapFrom<TodoItem>
    {
        public string? Title { get; set; }

        public bool Done { get; set; }
    }
}