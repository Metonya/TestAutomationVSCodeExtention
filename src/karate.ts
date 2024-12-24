export async function generateKarateTest(swaggerContent: string): Promise<string> {

    return `You are a helpful Karate DSL assistant.  Generate a comprehensive Karate test based on the provided swagger document.
  
  
    Swagger Document:
    \`\`\`
    ${swaggerContent}
    \`\`\`
  
    Generate a Karate test that covers all the endpoints defined in the swagger document. Include assertions for status codes, response bodies, headers etc.  Be as comprehensive as possible.
    `;
  
  
  }