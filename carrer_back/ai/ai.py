import os
from dotenv import load_dotenv
from .models import Text

load_dotenv()
gpt_key = os.getenv("GPT_KEY")
MODEL = "gpt-4.1"

_client = None

def get_client():
    global _client
    if _client is None:
        if not gpt_key:
            raise ValueError("GPT_KEY muhit o'zgaruvchisi o'rnatilmagan. .env faylga GPT_KEY qo'shing.")
        from openai import OpenAI
        _client = OpenAI(api_key=gpt_key)
    return _client


def generate_gpt_response(user_message, system_field="system", text_field="text"):
    system_text = Text.objects.values_list(system_field, flat=True).first() or ""
    prompt_text = Text.objects.values_list(text_field, flat=True).first() or ""

    messages = [
        {"role": "system", "content": str(system_text)},
        {"role": "user", "content": f"{prompt_text}\n\n{user_message}"}
    ]

    client = get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.5,
    )
    return response.choices[0].message.content


def chatbot_first(message):
    return generate_gpt_response(message, "system", "text")

def chatbot_second(message):
    return generate_gpt_response(message, "system", "text2")
