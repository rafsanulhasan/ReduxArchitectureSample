using MediatR;
using Microsoft.Extensions.Logging;
using ReduxArchitecture.Application.Common.Models;
using ReduxArchitecture.Domain.Events;

namespace ReduxArchitecture.Application.TodoItems.EventHandlers
{
    public class TodoItemCreatedEventHandler : INotificationHandler<DomainEventNotification<TodoItemCreatedEvent>>
    {
        private readonly ILogger<TodoItemCreatedEventHandler> _logger;

        public TodoItemCreatedEventHandler(ILogger<TodoItemCreatedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task Handle(DomainEventNotification<TodoItemCreatedEvent> notification, CancellationToken cancellationToken)
        {
            var domainEvent = notification.DomainEvent;

            _logger.LogInformation("ReduxArchitecture Domain Event: {DomainEvent}", domainEvent.GetType().Name);

            return Task.CompletedTask;
        }
    }
}