using ReduxArchitecture.Domain.Common;

namespace ReduxArchitecture.Application.Common.Interfaces
{
    public interface IDomainEventService
    {
        Task Publish(DomainEvent domainEvent);
    }
}