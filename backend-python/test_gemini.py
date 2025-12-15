import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key present: {bool(api_key)}")

try:
    genai.configure(api_key=api_key)
    print("✓ Gemini configured successfully")
    
    # Test with the actual model being used
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")
    print("✓ Model created successfully")
    
    response = model.generate_content("Say hello in one word")
    print(f"✓ Response: {response.text}")
    
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {e}")
