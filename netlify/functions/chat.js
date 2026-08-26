exports.handler = async (event) => {
  const key = process.env.OPENAI_API_KEY;

  try {
    const { message } = JSON.parse(event.body);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await res.json();

    // GIBT DEN ECHTEN FEHLER AUS
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: data.content[0].text
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
        stack: e.stack
      })
    };
  }
};
