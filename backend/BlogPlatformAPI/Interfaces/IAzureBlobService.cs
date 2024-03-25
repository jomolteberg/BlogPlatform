using Azure.Storage.Blobs;

namespace BlogPlatformAPI.Interfaces;

public interface IAzureBlobService
{
    Task<string> UploadFileAsync(string containerName, Stream fileStream, string fileName, string contentType);
    // Add other blob storage operations as needed
}

public class AzureBlobService : IAzureBlobService
{
    private readonly BlobServiceClient _blobServiceClient;

    public AzureBlobService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public async Task<string> UploadFileAsync(string containerName, Stream fileStream, string fileName, string contentType)
    {
        var blobContainer = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = blobContainer.GetBlobClient(fileName);

        await blobClient.UploadAsync(fileStream, new Azure.Storage.Blobs.Models.BlobHttpHeaders { ContentType = contentType });
        
        return blobClient.Uri.ToString();
    }
}
