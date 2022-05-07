using FluentAssertions;
using NUnit.Framework;
using ReduxArchitecture.Application.TodoLists.Queries.GetTodos;
using ReduxArchitecture.Domain.Entities;
using ReduxArchitecture.Domain.ValueObjects;

namespace ReduxArchitecture.Application.IntegrationTests.TodoLists.Queries;

public class GetTodosTests : TestBase
{
    [Test]
    public async Task ShouldReturnPriorityLevels()
    {
        var query = new GetTodosQuery();

        var result = await Testing.SendAsync(query);

        result.PriorityLevels.Should().NotBeEmpty();
    }

    [Test]
    public async Task ShouldReturnAllListsAndItems()
    {
        await Testing.AddAsync(new TodoList
        {
            Title = "Shopping",
            Colour = Colour.Blue,
            Items =
                {
                    new TodoItem { Title = "Apples", Done = true },
                    new TodoItem { Title = "Milk", Done = true },
                    new TodoItem { Title = "Bread", Done = true },
                    new TodoItem { Title = "Toilet paper" },
                    new TodoItem { Title = "Pasta" },
                    new TodoItem { Title = "Tissues" },
                    new TodoItem { Title = "Tuna" }
                }
        });

        var query = new GetTodosQuery();

        var result = await Testing.SendAsync(query);

        result.Lists.Should().HaveCount(1);
        result.Lists.First().Items.Should().HaveCount(7);
    }
}
