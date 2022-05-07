using NUnit.Framework;

namespace ReduxArchitecture.Application.IntegrationTests;

public class TestBase
{
    [SetUp]
    public async Task TestSetUp()
    {
        await Testing.ResetState();
    }
}
