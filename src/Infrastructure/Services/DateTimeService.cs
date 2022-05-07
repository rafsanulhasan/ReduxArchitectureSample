using ReduxArchitecture.Application.Common.Interfaces;

namespace ReduxArchitecture.Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.Now;
}
