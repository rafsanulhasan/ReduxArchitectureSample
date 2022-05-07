using FluentAssertions;
using NUnit.Framework;
using ReduxArchitecture.Application.Common.Exceptions;
using ReduxArchitecture.Application.TodoItems.Commands.CreateTodoItem;
using ReduxArchitecture.Application.TodoItems.Commands.DeleteTodoItem;
using ReduxArchitecture.Application.TodoLists.Commands.CreateTodoList;
using ReduxArchitecture.Domain.Entities;

namespace ReduxArchitecture.Application.IntegrationTests.TodoItems.Commands;

public class DeleteTodoItemTests : TestBase
{
    [Test]
    public async Task ShouldRequireValidTodoItemId()
    {
        var command = new DeleteTodoItemCommand { Id = 99 };

        await FluentActions.Invoking(() =>
            Testing.SendAsync(command)).Should().ThrowAsync<NotFoundException>();
    }

    [Test]
    public async Task ShouldDeleteTodoItem()
    {
        var listId = await Testing.SendAsync(new CreateTodoListCommand
        {
            Title = "New List"
        });

        var itemId = await Testing.SendAsync(new CreateTodoItemCommand
        {
            ListId = listId,
            Title = "New Item"
        });

        await Testing.SendAsync(new DeleteTodoItemCommand
        {
            Id = itemId
        });

        var item = await Testing.FindAsync<TodoItem>(itemId);

        item.Should().BeNull();
    }
}
