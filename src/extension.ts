// extension.ts
import * as vscode from 'vscode';
import { getSwaggerFromBitbucket } from './bitbucket';
import { generateKarateTest } from './karate';

// Prompts
const BASE_PROMPT = 'You are a helpful test automation assistant. I can help you with various test automation tasks, including generating Karate tests, reviewing your existing tests, and answering your test automation related questions.';
const KARATE_CATEGORY_PROMPT = `You are a helpful assistant determining the user's intent within the /karate command of a test automation tool.  The user will provide input related to one of the following categories:
* **repository:** User provides a repository name to generate tests from a swagger file.  They may provide the repository name directly or ask for a Karate test from a specific repository.
* **question:** User asks a question about Karate DSL. They might ask how to do something in Karate or ask for an explanation of a Karate concept.
* **problem:** User describes a problem they are facing with their Karate tests.  They might provide an error message or ask how to fix a specific Karate issue.
* **test execution:** User wants to execute their Karate tests. They might ask how to run their tests or how to configure their test runner.
* **review:** User provides a .feature file (Karate test file) for review. They may directly paste the content or provide the path to their file.  Sometimes they will ask you to review their code without explicitly providing the code.

Classify the user input into one of these categories. **Only respond with the category name.**  Do not provide any further explanations or instructions.`;
const REVIEW_PROMPT = (featureFileContent: string) => `You are a helpful Karate DSL code reviewer. Review the provided Karate (.feature) file and provide feedback on the following aspects:

* **Correctness:** Are there any syntax errors or logical issues in the test logic?
* **Completeness:** Does the test cover all the necessary scenarios and edge cases?
* **Readability and Maintainability:** Is the code easy to understand and maintain? Are there any improvements that can be made to the code structure or naming conventions?
* **Efficiency and Performance:** Are there any performance bottlenecks or areas where the test execution can be optimized?
* **Best Practices:**  Does the code follow Karate best practices?

Provide specific suggestions for improvement with examples.  If the provided content is not a valid Karate feature file, politely inform the user.

\`\`\`
${featureFileContent}
\`\`\`
`;

export function activate(context: vscode.ExtensionContext) {

    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken) => {
        let prompt = BASE_PROMPT;
        let userMessage = request.prompt;

        if (request.command === 'karate') {
            try {
                const classificationResponse = await request.model.sendRequest([
                    vscode.LanguageModelChatMessage.User(KARATE_CATEGORY_PROMPT),
                    vscode.LanguageModelChatMessage.User(userMessage)
                ], {}, token);

                const category = (await resolveAsyncIterableToString(classificationResponse.text)).trim();

                switch (category) {
                    case 'repository':

                        // Bitbucket integration commented out for testing with direct URL
                        /*
                        const inputParts = userMessage.trim().split(' ');
                        const repoName = inputParts[1];
                        let swaggerContent = await getSwaggerFromBitbucket(repoName);
                        if (!swaggerContent) {
                            // ... error handling
                        }
                        */

                        // Directly fetch from URL for testing:
                        const swaggerContent = await getSwaggerFromUrl("https://raw.githubusercontent.com/swagger-api/swagger-petstore/refs/heads/master/src/main/resources/openapi.yaml");

                        if (!swaggerContent) {
                            stream.markdown("Test Swagger dosyası indirilemedi.");
                            return;
                        }

                        prompt = await generateKarateTest(swaggerContent);
                        userMessage = "";

                        break;
                    case 'question':
                        prompt = 'You are a helpful Karate DSL assistant. Answer the users questions about Karate DSL. If the question is not related to Karate, politely decline to answer.';
                        break;
                    case 'problem':
                        stream.markdown("Problem çözme özelliği yapım aşamasındadır.");
                        return;
                    case 'test execution':
                        stream.markdown("Test çalıştırma özelliği yapım aşamasındadır.");
                        return;
                    /*
                    case 'review':
                        let featureFileContent = "";
                        const inputDocuments = request.inputDocuments;

                        if (inputDocuments && inputDocuments.length > 0) {
                            const firstDocument = inputDocuments[0]; // Get the first uploaded document

                            if (firstDocument.languageId === 'feature'){ // check language id. it must be karate language.

                            featureFileContent = new TextDecoder().decode(await vscode.workspace.fs.readFile(firstDocument.uri));


                            prompt = REVIEW_PROMPT(featureFileContent);

                            userMessage = "";


                            } else {

                                stream.markdown("Lütfen bir Karate (.feature) dosyası yükleyin.");

                                return;
                            }
                        } else {
                            stream.markdown("Lütfen incelemek istediğiniz Karate (.feature) dosyasını yükleyin.");
                            return;

                        }
                        break;
                        */
                    default:
                        stream.markdown("Geçersiz kategori veya komut.");
                        return;
                }
            } catch (error) {
                stream.markdown(`Hata: ${error}`); // Corrected error handling
                return;
            }
        } else {
            prompt = 'You are a helpful Test Automation assistant. Answer the users questions about Test Automation (Karate, Selenium, JMeter, API Testing etc.) If the question is not related to Test Automation, politely decline to answer.';
        }

        const messages = [
            vscode.LanguageModelChatMessage.User(prompt),
            vscode.LanguageModelChatMessage.User(userMessage)
        ];

        const previousMessages = context.history.filter(h => h instanceof vscode.ChatResponseTurn);
        previousMessages.forEach(m => {
            let fullMessage = '';
            m.response.forEach(r => {
                const mdPart = r as vscode.ChatResponseMarkdownPart;
                fullMessage += mdPart.value.value;
            });
            messages.push(vscode.LanguageModelChatMessage.Assistant(fullMessage));
        });

        const chatResponse = await request.model.sendRequest(messages, {}, token);

        for await (const fragment of chatResponse.text) {
            stream.markdown(fragment);
        }
    };

    const testAutomationParticipant = vscode.chat.createChatParticipant("testautomation.testautomation", handler);
    testAutomationParticipant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'testautomation.png');
}

async function resolveAsyncIterableToString(iterable: AsyncIterable<string>): Promise<string> {
    let fullString = "";
    for await (const chunk of iterable) {
        fullString += chunk;
    }
    return fullString;
}

async function getSwaggerFromUrl(url: string): Promise<string | undefined> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Swagger dosyası indirilemedi: ${response.status} ${response.statusText}`);
        }
        const swaggerContent = await response.text();
        return swaggerContent;
    } catch (error) {
        console.error("Swagger dosyası indirilemedi:", error);
        return undefined;
    }
}

export function deactivate() { }