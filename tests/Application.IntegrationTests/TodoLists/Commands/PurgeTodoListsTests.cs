using FluentAssertions;
using NUnit.Framework;
using ReduxArchitecture.Application.Common.Exceptions;
using ReduxArchitecture.Application.Common.Security;
using ReduxArchitecture.Application.TodoLists.Commands.CreateTodoList;
using ReduxArchitecture.Application.TodoLists.Commands.PurgeTodoLists;
using ReduxArchitecture.Domain.Entities;

namespace ReduxArchitecture.Application.IntegrationTests.TodoLists.Commands;

public class PurgeTodoListsTests : TestBase
{
    [Test]
    public async Task ShouldDenyAnonymousUser()
    {
        var command = new PurgeTodoListsCommand();

        command.GetType().Should().BeDecoratedWith<AuthorizeAttribute>();

        await FluentActions.Invoking(() =>
            Testing.SendAsync(command)).Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Test]
    public async Task ShouldDenyNonAdministrator()
    {
        await Testing.RunAsDefaultUserAsync();

        var command = new PurgeTodoListsCommand();

        await FluentActions.Invoking(() =>
             Testing.SendAsync(command)).Should().ThrowAsync<ForbiddenAccessException>();
    }

    [Test]
    public async Task ShouldAllowAdministrator()
    {
        await Testing.RunAsAdministratorAsync();

        var command = new PurgeTodoListsCommand();

        await FluentActions.Invoking(() => Testing.SendAsync(command))
             .Should().NotThrowAsync<ForbiddenAccessException>();
    }

    [Test]
    public async Task ShouldDeleteAllLists()
    {
        await Testing.RunAsAdministratorAsync();

        await Testing.SendAsync(new CreateTodoListCommand
        {
            Title = "New List #1"
        });

        await Testing.SendAsync(new CreateTodoListCommand
        {
            Title = "New List #2"
        });

        await Testing.SendAsync(new CreateTodoListCommand
        {
            Title = "New List #3"
        });

        await Testing.SendAsync(new PurgeTodoListsCommand());

        var count = await Testing.CountAsync<TodoList>();

        count.Should().Be(0);
    }
}
