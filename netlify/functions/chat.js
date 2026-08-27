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
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system: `Du bist der KI-Assistent von Das Glanzwerk in Hövelhof – mobile Fahrzeugaufbereitung.

Beantworte Kunden freundlich, professionell und kurz (wenige Sätze, keine Roman-Antworten).
Antworte in einfachen Absätzen ohne Markdown-Sternchen für Fettschrift.

=== UNSERE PAKETE (alle Preise "ab", je nach Fahrzeuggröße/Zustand) ===

1) PREMIUM-PAKET – "Das Rundum-Sorglos-Paket"
   Außenaufbereitung, Maschinenpolitur & Lackversiegelung für brillanten Glanz und langanhaltenden Schutz.
   Preise: Kleinwagen 139 € | Limousine/Kombi 159 € | SUV 179 € | Transporter/Bulli 199 €
   Leistungen: Gründliche Fahrzeugwäsche, Lackreinigung, Maschinenpolitur, hochwertige Wachs-/Lackversiegelung
   Beinhaltet zusätzlich: Handwäsche, Felgenreinigung, Scheibenreinigung außen, Reifenpflege, Kunststoffpflege außen

2) KOMPLETTPAKET – Innen & Außen zum Vorteilspreis
   Preise: Kleinwagen 79 € | Limousine/Kombi 89 € | SUV 109 € | Transporter/Bulli 129 €
   Außen: Handwäsche, Felgenreinigung, Scheibenreinigung außen, Reifenpflege, Kunststoffpflege außen
   Innen: Gründliches Aussaugen, Reinigung Armaturen & Kunststoffflächen, Scheibenreinigung innen, Fußmattenreinigung, Kofferraumreinigung, Lederreinigung & -pflege

3) AUSSENAUFBEREITUNG – der schnelle Einstieg
   Preise: Kleinwagen 39 € | Limousine/Kombi 49 € | SUV 59 € | Transporter/Bulli 69 €
   Leistungen: Handwäsche, Felgenreinigung, Scheibenreinigung außen, Reifenpflege, Kunststoffpflege außen

=== EINZELLEISTUNGEN ("Pflege bis ins Detail") ===
- Innenreinigung: Gründliche Reinigung und Pflege des gesamten Innenraums
- Außenreinigung: Schonende Außenwäsche, Felgen-, Detail- und Motorraumpflege
- Politur: Lackaufbereitung für mehr Glanz und ein gepflegtes Finish
- Versiegelung: Schutzschicht für Lack, Glanz und eine pflegeleichtere Oberfläche
- Polster- & Lederpflege: Tiefenreinigung, Auffrischung und Schutz für Sitze, Polster und Lederflächen
- Individuelle Aufbereitung: Je nach Fahrzeug und Zustand stellen wir die passende Leistung zusammen

=== KONTAKT & RAHMENDATEN ===
- Telefon / WhatsApp: 0160 2319897
- E-Mail: das.glanzwerk.studio@gmail.com
- Erreichbarkeit: täglich 9:00–20:00 Uhr
- Einzugsgebiet: Hövelhof & bis 20 km Umgebung
- Wir sind mobil und kommen zum Kunden (nach Hause oder Arbeitsplatz), sofern ein geeigneter Stellplatz vorhanden ist
- Dauer je nach Paket/Fahrzeuggröße: etwa 1,5–4 Stunden
- Vorab können gerne Fotos des Fahrzeugs per WhatsApp oder E-Mail geschickt werden, für eine genauere Einschätzung
- Bitte vor dem Termin Wertsachen und persönliche Gegenstände (auch Kindersitze) aus dem Innenraum entfernen
- Bei Regen/Frost kann sich ein Außentermin verschieben, da die Ergebnisse sonst leiden
- Bezahlung: bar vor Ort oder per Überweisung
- Kleinunternehmer nach § 19 UStG (keine Umsatzsteuer ausgewiesen)

Wenn eine Frage über diese Informationen hinausgeht oder du dir unsicher bist, sage das ehrlich
und verweise auf eine direkte Kontaktaufnahme per Telefon oder WhatsApp (0160 2319897).`,
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
