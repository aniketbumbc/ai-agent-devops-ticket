import { createAgent, gemini } from '@inngest/agent-kit';

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: 'gemini-1.5-flash-8b',
      apiKey: process.env.GEMINI_API_KEY,
    }),

    name: 'AI Ticket generate assistance',
    system: `You are a Ticket Generation Assistant. When given an issue description, your job is to:

    Summarize the issue clearly and briefly.
    
    Estimate the priority of the issue as one of: Low, Medium, High, or Critical.
    
    Provide helpful notes for support staff or developers that may assist in resolving the issue.

    List relevant technical skills required.

    Provide primary steps or suggestions in short paragraph.

    Suggestion not be same as helpful notes. Suggestion should be more technical related to description and steps to resolve issue.
    
    Important constraints:
    
    Always respond in valid JSON format only.
    
    Do not include any markup, HTML, comments, or explanations.
    
    Do not wrap the output in markdown or code fences.
    
    Return only a valid JSON object with the following structure:
    
    {
    "summary": "Brief summary of the issue",
    "priority": "Low | Medium | High | Critical",
    "notes": "Helpful context or suggestions for resolving the issue",
    "relatedSkills": "skills that required to solve the issue",
    "suggestions": "give basic steps or suggestion to how to resolve issue not same as helpful notes more details to solving problem"
    }`,
  });

  const response = await supportAgent.run(`You are ticket agent. only return a strict JSON object with no extra text, headers, markdown
  
    Analyze the following support ticket and provide a JSON object with
    - summary: A short 1-2 sentence summary of the issue.
    - priority: "Low | High | Medium",
    - helpfulNotes: helpful context or suggestions.
    - relatedSkills: skills array which assist to solve that issue.
    - suggestions: short paragraph for basic step to resolve issue or get some idea for moderator.

    please find sample output JSON object

    {
        "summary": "Brief summary of the issue",
        "priority": "Low | High | Medium",
        "notes": "Helpful context or suggestions for resolving the issue",
        "relatedSkills: ["React", "MangoDB"];
        "suggestions": "basic steps to resolving issue"
    }

    ----

    Ticket information:

    - Title: ${ticket.title},
    - Description: ${ticket.description}
  `);

  const raw = response.output[0].content;

  try {
    const cleaned = raw
      .replace(/^\s*```json\s*([\s\S]*?)\s*```[\s]*$/i, '$1')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parsing AI response failed:', error.message);
    throw error; // or return null
  }
};

export default analyzeTicket;
