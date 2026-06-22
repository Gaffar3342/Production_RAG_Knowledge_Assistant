from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
client=OpenAI(api_key=os.getenv("_OPENAI_API_KEY"))
def generate_answer(context,question:str):
   response= client.chat.completions.create(
        model="gpt-4.1-mini"
        ,messages=[
            {
                "role":"system","content":"Answer only using the provied context."
            },
            {
                "role":"user","content":f"""
                Context:{context}
                Question:{question}
                """
            }]
    )
   return response.choices[0].message.content