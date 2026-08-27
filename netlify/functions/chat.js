exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Method not allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    if (!message || typeof message !== "string" || !message.trim()) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "Bitte gib eine Nachricht ein." })
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        // WICHTIG: Der Key muss unter dem Namen ANTHROPIC_API_KEY in den
        // Netlify Umgebungsvariablen (Site settings -> Environment variables) hinterlegt sein.
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        // Gültiger, aktueller Modellname (mit Versions-Suffix)
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: `Du bist der KI-Assistent von Das Glanzwerk in Hövelhof.

Beantworte Kunden freundlich, professionell und kurz.
Themen: Fahrzeugaufbereitung, Innenreinigung, Außenreinigung, Politur, Keramikversiegelung und Terminanfragen.
Preise (ab-Preise, je nach Fahrzeuggröße/Zustand):
- Außenaufbereitung: ab 39 € (Kleinwagen) bis 69 € (Transporter)
- Komplettpaket (Innen & Außen): ab 79 € bis 129 €
- Premium-Paket (inkl. Politur & Versiegelung): ab 139 € bis 199 €
Erreichbarkeit: täglich 9-20 Uhr, telefonisch/WhatsApp unter 0160 2319897.
Einzugsgebiet: Hövelhof & bis 20 km Umgebung.
Wenn Informationen fehlen, sage das ehrlich und verweise auf eine Kontaktaufnahme per Telefon oder WhatsApp.
Antworte kurz und in einfachen Absätzen, ohne Markdown-Sternchen für Fettschrift.`,
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
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
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        reply: err.message
      })
    };
  }
};
