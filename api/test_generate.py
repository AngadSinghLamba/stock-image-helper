#!/usr/bin/env python3
"""
Test script for the query generation service.
Run this to verify your LLM API keys are working.

Usage:
    cd api
    source venv/bin/activate
    python test_generate.py
"""

import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env.local in parent directory
env_path = Path(__file__).parent.parent / ".env.local"
if env_path.exists():
    load_dotenv(env_path)
    print(f"✓ Loaded environment from {env_path}")
else:
    print(f"⚠ No .env.local found at {env_path}")
    print("  Create .env.local with your API keys to test.")
    sys.exit(1)

# Check which API keys are configured
print("\n--- API Key Status ---")
openai_key = os.getenv("OPENAI_API_KEY", "")
anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
google_key = os.getenv("GOOGLE_AI_API_KEY", "")

print(f"OpenAI:    {'✓ Configured' if openai_key and not openai_key.startswith('sk-xxxx') else '✗ Not configured'}")
print(f"Anthropic: {'✓ Configured' if anthropic_key and not anthropic_key.startswith('sk-ant-xxxx') else '✗ Not configured'}")
print(f"Google AI: {'✓ Configured' if google_key and len(google_key) > 20 else '✗ Not configured'}")

if not any([
    openai_key and not openai_key.startswith('sk-xxxx'),
    anthropic_key and not anthropic_key.startswith('sk-ant-xxxx'),
    google_key and len(google_key) > 20
]):
    print("\n✗ No valid API keys found. Please configure at least one in .env.local")
    sys.exit(1)

# Import the service
from shared.llm_service import generate_queries

async def main():
    print("\n--- Testing Query Generation ---")
    print("Brief: 'Ford truck in mountains, sunrise, cinematic adventure feel'")
    print("Model: gpt-4o (with fallback)")
    print("Platforms: getty, shutterstock")
    print("\nGenerating queries...\n")
    
    try:
        result = await generate_queries(
            brief="Ford truck in mountains, sunrise, cinematic adventure feel",
            model="gpt-4o",
            platforms=["getty", "shutterstock"]
        )
        
        print("✓ Success!\n")
        print("=== Brief Analysis ===")
        print(f"Subject:     {result.brief_analysis.subject}")
        print(f"Setting:     {result.brief_analysis.setting}")
        print(f"Lighting:    {result.brief_analysis.lighting}")
        print(f"Mood:        {result.brief_analysis.mood}")
        print(f"Composition: {result.brief_analysis.composition}")
        print(f"Style:       {result.brief_analysis.style}")
        
        print(f"\n=== Generated Queries ({len(result.queries)}) ===")
        for i, query in enumerate(result.queries, 1):
            print(f"\n{i}. [{query.platform.upper()}]")
            print(f"   Query: {query.query}")
            print(f"   URL: {query.url}")
            print(f"   Reasoning: {query.reasoning}")
        
        print(f"\n✓ Model used: {result.model_used}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
