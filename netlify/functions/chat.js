exports.handler = async (event) => {
  // Nur POST erlauben
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        input: [
          {
            role: "system",
            content: `Du bist der KI-Assistent von Das Glanzwerk in Hövelhof.

Beantworte Fragen freundlich und kurz.
Themen: Fahrzeugaufbereitung, Innenreinigung, Außenreinigung,
Politur, Keramikversiegelung und Terminanfragen.
Wenn etwas unbekannt ist, bitte den Kunden um Kontakt per Telefon oder WhatsApp.`
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    const data = await response.json();

    const text =
      data.output?.[0]?.content?.[0]?.text ||
      "Entschuldigung, ich konnte gerade nicht antworten.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply: text }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};