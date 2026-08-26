exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Method not allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.OPENAI_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system: `Du bist der KI-Assistent von Das Glanzwerk in Hövelhof.

Beantworte Kunden freundlich, professionell und kurz.
Themen: Fahrzeugaufbereitung, Innenreinigung, Außenreinigung, Politur, Keramikversiegelung und Terminanfragen.
Wenn Informationen auf der Website fehlen, sage das ehrlich und verweise auf eine Kontaktaufnahme per Telefon oder WhatsApp.`,
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: data.error?.message || "Anthropic API Fehler"
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
        reply: data.content[0].text
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: err.message
      })
    };
  }
};
