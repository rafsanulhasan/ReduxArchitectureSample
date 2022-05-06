using Microsoft.EntityFrameworkCore;
using ReduxArchitecture.Domain.Entities;

namespace ReduxArchitecture.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<TodoList> TodoLists { get; }

        DbSet<TodoItem> TodoItems { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}