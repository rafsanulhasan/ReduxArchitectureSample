using CsvHelper;
using ReduxArchitecture.Application.Common.Interfaces;
using ReduxArchitecture.Application.TodoLists.Queries.ExportTodos;
using ReduxArchitecture.Infrastructure.Files.Maps;
using System.Globalization;

namespace ReduxArchitecture.Infrastructure.Files;

public class CsvFileBuilder : ICsvFileBuilder
{
    public byte[] BuildTodoItemsFile(IEnumerable<TodoItemRecord> records)
    {
        using var memoryStream = new MemoryStream();
        using (var streamWriter = new StreamWriter(memoryStream))
        {
            using var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);

            csvWriter.Configuration.RegisterClassMap<TodoItemRecordMap>();
            csvWriter.WriteRecords(records);
        }

        return memoryStream.ToArray();
    }
}
