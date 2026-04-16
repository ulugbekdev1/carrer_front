from openai import OpenAI
import os
def chatbot_response(message):
    MODEL = "gpt-3.5-turbo"
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            # {"role": "system", "content": "You are a laconic assistant. You reply with brief, to-the-point answers with no elaboration."},
            {"role": "user", "content": f"I am interested in these things {message}, which IT field can you choose for me based on my interest?"},
        ],
        temperature=0,
    )

    return response.choices[0].message.content

