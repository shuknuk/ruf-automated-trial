export async function fetchChatResponse(query: string): Promise<string> {
    // Use env var for Render URL, fallback to localhost for dev
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error("Failed to fetch chat response:", error);
        return "Sorry, I am having trouble connecting to the Rutgers policy database right now.";
    }
}

