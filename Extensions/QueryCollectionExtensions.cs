namespace MicropostsApp.Extensions
{
    public static class QueryCollectionExtensions
    {
        public static string GetValueOrDefault(this IQueryCollection queryCollection, string key, string defaultValue)
        {
            return queryCollection.TryGetValue(key: key, value: out var value) ? value.ToString() : defaultValue;
        }
    }
}