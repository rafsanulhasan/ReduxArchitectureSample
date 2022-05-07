using FluentAssertions;
using NUnit.Framework;
using ReduxArchitecture.Application.Common.Exceptions;
using ReduxArchitecture.Application.TodoLists.Commands.CreateTodoList;
using ReduxArchitecture.Application.TodoLists.Commands.DeleteTodoList;
using ReduxArchitecture.Domain.Entities;

namespace ReduxArchitecture.Application.IntegrationTests.TodoLists.Commands;

public class DeleteTodoListTests : TestBase
{
    [Test]
    public async Task ShouldRequireValidTodoListId()
    {
        var command = new DeleteTodoListCommand { Id = 99 };
        await FluentActions.Invoking(() => Testing.SendAsync(command)).Should().ThrowAsync<NotFoundException>();
    }

    [Test]
    public async Task ShouldDeleteTodoList()
    {
        var listId = await Testing.SendAsync(new CreateTodoListCommand
        {
            Title = "New List"
        });

        await Testing.SendAsync(new DeleteTodoListCommand
        {
            Id = listId
        });

        var list = await Testing.FindAsync<TodoList>(listId);

        list.Should().BeNull();
    }
}
