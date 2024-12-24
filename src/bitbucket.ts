import * as vscode from 'vscode';

export async function getSwaggerFromBitbucket(repoName: string): Promise<string | undefined> {
    // TODO: Implement your Bitbucket integration logic here.  
    // This is a placeholder.  Replace with your actual code to fetch 
    // the swagger file from Bitbucket using the repoName.

    // Example (replace with your actual implementation):
    const baseUrl = 'your_bitbucket_base_url'; // Replace with your Bitbucket base URL
    const directory = 'your_swagger_directory'; // Replace with the directory containing swagger files
    const apiUrl = `${baseUrl}/${repoName}/${directory}/swagger.json`; // Construct the API URL
     try {
        // Send request to Bitbucket API
        const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${getToken()}` // Get the token
                }
            });


            if (!response.ok) {
                throw new Error(`Bitbucket API isteği başarısız oldu: ${response.status} ${response.statusText}`);
            }


            const swaggerContent = await response.text();
        return swaggerContent;
    } catch (error) {


        console.error("Bitbucket'tan swagger dosyası alınamadı:", error);


        return undefined;

    }
}

function getToken(): string | undefined {
    // TODO: Implement your token retrieval logic here.
    // This could involve using VS Code's SecretStorage API or another secure method.

    // Placeholder:
    return 'your_bitbucket_token';  // Replace with your actual token retrieval logic
}