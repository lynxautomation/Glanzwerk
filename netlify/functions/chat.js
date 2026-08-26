exports.handler = async (event) => {
  try {
    const key = process.env.OPENAI_API_KEY;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        env_exists: !!key,
        key_prefix: key ? key.substring(0, 7) : null,
        key_length: key ? key.length : 0
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
