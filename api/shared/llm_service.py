"""LLM service for query generation using LangChain."""

import os
import logging
from typing import Optional

from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException

from .models import GenerateResponse, BriefAnalysis, SearchQuery
from .url_builders import build_url

logger = logging.getLogger(__name__)

# System prompt for stock image search expert
SYSTEM_PROMPT = """You are an expert at finding stock images for creative professionals. 
Given a creative brief, you analyze it to extract key visual elements and generate 
optimized search queries for stock image platforms.

Your task:
1. Analyze the brief to identify: subject, setting, lighting, mood, composition, and style
2. Generate 2-3 search queries per platform that will find the best matching images
3. Each query should be optimized for the specific platform's search algorithm

Platform-specific tips:
- Getty Images: Use descriptive, professional terms. Add "editorial" for real-world/news shots.
- Shutterstock: Shorter, focused queries work better. Use common photography terms.
- Adobe Stock: Similar to Getty, supports detailed descriptive queries.
- Unsplash: Simple, mood-based queries. Focus on atmosphere and feeling.
- Pexels: Similar to Unsplash. Simple, evocative terms work best.

Always respond in the exact JSON format specified. Be creative but accurate."""


def get_llm(model: str):
    """Get the appropriate LLM based on model name."""
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    google_key = os.getenv("GOOGLE_AI_API_KEY")
    
    if model.startswith("gpt"):
        if not openai_key:
            raise ValueError("OPENAI_API_KEY not configured")
        return ChatOpenAI(model=model, api_key=openai_key, temperature=0.7)
    
    elif model.startswith("claude"):
        if not anthropic_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        return ChatAnthropic(model=model, api_key=anthropic_key, temperature=0.7)
    
    elif model.startswith("gemini"):
        if not google_key:
            raise ValueError("GOOGLE_AI_API_KEY not configured")
        return ChatGoogleGenerativeAI(model=model, google_api_key=google_key, temperature=0.7)
    
    else:
        # Default to GPT-4o
        if not openai_key:
            raise ValueError("OPENAI_API_KEY not configured")
        return ChatOpenAI(model="gpt-4o", api_key=openai_key, temperature=0.7)


def get_fallback_models():
    """Get list of fallback models based on available API keys."""
    fallbacks = []
    
    if os.getenv("ANTHROPIC_API_KEY"):
        fallbacks.append(("claude-3-5-sonnet-20241022", "anthropic"))
    
    if os.getenv("GOOGLE_AI_API_KEY"):
        fallbacks.append(("gemini-2.0-flash", "google"))
    
    if os.getenv("OPENAI_API_KEY"):
        fallbacks.append(("gpt-4o-mini", "openai"))
    
    return fallbacks


async def generate_queries(
    brief: str,
    model: str = "gpt-4o",
    platforms: list[str] = None,
    session_id: Optional[str] = None
) -> GenerateResponse:
    """
    Generate stock image search queries from a creative brief.
    
    Args:
        brief: The creative brief describing desired images
        model: LLM model to use (gpt-4o, claude-3-5-sonnet, gemini-1.5-pro, etc.)
        platforms: List of platforms to generate queries for
        session_id: Optional session ID for conversation memory (future use)
    
    Returns:
        GenerateResponse with brief analysis and search queries
    """
    if platforms is None:
        platforms = ["getty", "shutterstock"]
    
    # Set up the output parser
    parser = PydanticOutputParser(pydantic_object=GenerateResponse)
    
    # Create the prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", """Creative Brief: {brief}

Platforms to generate queries for: {platforms}

{format_instructions}

Remember:
- Generate 2-3 queries per platform
- Each query should target different aspects of the brief
- Provide clear reasoning for each query""")
    ])
    
    # Try primary model, then fallbacks
    models_to_try = [(model, "primary")]
    models_to_try.extend(get_fallback_models())
    
    last_error = None
    model_used = model
    
    for model_name, source in models_to_try:
        try:
            logger.info(f"Attempting to use model: {model_name} ({source})")
            
            llm = get_llm(model_name)
            chain = prompt | llm | parser
            
            result = await chain.ainvoke({
                "brief": brief,
                "platforms": ", ".join(platforms),
                "format_instructions": parser.get_format_instructions()
            })
            
            # Add URLs to each query
            for query in result.queries:
                if not query.url:
                    query.url = build_url(query.query, query.platform)
            
            # Set the model that was actually used
            result.model_used = model_name
            
            logger.info(f"Successfully generated {len(result.queries)} queries using {model_name}")
            return result
            
        except OutputParserException as e:
            logger.warning(f"Output parsing failed for {model_name}: {e}")
            last_error = e
            continue
            
        except Exception as e:
            logger.warning(f"Model {model_name} failed: {e}")
            last_error = e
            continue
    
    # All models failed
    raise RuntimeError(f"All LLM models failed. Last error: {last_error}")


def generate_queries_sync(
    brief: str,
    model: str = "gpt-4o",
    platforms: list[str] = None,
    session_id: Optional[str] = None
) -> GenerateResponse:
    """Synchronous version of generate_queries for Azure Functions."""
    import asyncio
    return asyncio.run(generate_queries(brief, model, platforms, session_id))
