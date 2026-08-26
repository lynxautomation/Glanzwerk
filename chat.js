exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);

    const ai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        input: `Du bist der Chatbot von Das Glanzwerk.

Kundenfrage: ${message}`
      })
    });

    const data = await ai.json();

    if (!ai.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: `OpenAI Fehler: ${data.error?.message || "Unbekannt"}`
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        reply: data.output_text
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: err.message
      })
    };
  }
};