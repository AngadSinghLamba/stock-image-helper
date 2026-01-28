"""Azure Functions app for Stock Image Helper API."""

import json
import logging
import azure.functions as func
from dotenv import load_dotenv

from shared.models import GenerateRequest, GenerateResponse
from shared.llm_service import generate_queries_sync

# Load environment variables for local development
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the Function App
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="generate", methods=["POST"])
def generate(req: func.HttpRequest) -> func.HttpResponse:
    """
    Generate stock image search queries from a creative brief.
    
    Request body:
    {
        "brief": "Ford truck in mountains, sunrise, cinematic",
        "model": "gpt-4o",  // optional, defaults to gpt-4o
        "platforms": ["getty", "shutterstock"]  // optional
    }
    
    Response:
    {
        "brief_analysis": {
            "subject": "pickup truck",
            "setting": "mountain landscape",
            "lighting": "sunrise, golden hour",
            "mood": "adventure, freedom",
            "composition": "wide shot",
            "style": "cinematic"
        },
        "queries": [
            {
                "query": "pickup truck mountain sunrise golden hour",
                "platform": "getty",
                "url": "https://www.gettyimages.com/search/...",
                "reasoning": "Combines main subject with setting and lighting"
            }
        ],
        "model_used": "gpt-4o"
    }
    """
    logger.info("Generate endpoint called")
    
    # Parse request body
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON in request body"}),
            status_code=400,
            mimetype="application/json"
        )
    
    # Validate required fields
    brief = req_body.get("brief", "").strip()
    if not brief:
        return func.HttpResponse(
            json.dumps({"error": "Brief is required and cannot be empty"}),
            status_code=400,
            mimetype="application/json"
        )
    
    # Extract optional parameters
    model = req_body.get("model", "gpt-4o")
    platforms = req_body.get("platforms", ["getty", "shutterstock"])
    session_id = req_body.get("session_id")
    
    # Validate platforms
    valid_platforms = {"getty", "shutterstock", "adobe", "unsplash", "pexels"}
    invalid_platforms = set(platforms) - valid_platforms
    if invalid_platforms:
        return func.HttpResponse(
            json.dumps({
                "error": f"Invalid platforms: {invalid_platforms}. Valid options: {valid_platforms}"
            }),
            status_code=400,
            mimetype="application/json"
        )
    
    # Generate queries
    try:
        logger.info(f"Generating queries for brief: {brief[:100]}...")
        logger.info(f"Model: {model}, Platforms: {platforms}")
        
        result = generate_queries_sync(
            brief=brief,
            model=model,
            platforms=platforms,
            session_id=session_id
        )
        
        logger.info(f"Generated {len(result.queries)} queries")
        
        return func.HttpResponse(
            result.model_dump_json(),
            mimetype="application/json"
        )
        
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
        
    except RuntimeError as e:
        logger.error(f"LLM error: {e}")
        return func.HttpResponse(
            json.dumps({"error": f"Failed to generate queries: {e}"}),
            status_code=500,
            mimetype="application/json"
        )
        
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        return func.HttpResponse(
            json.dumps({"error": "An unexpected error occurred"}),
            status_code=500,
            mimetype="application/json"
        )


@app.route(route="health", methods=["GET"])
def health(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint."""
    import os
    
    # Check which API keys are configured
    status = {
        "status": "healthy",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
        "google_configured": bool(os.getenv("GOOGLE_AI_API_KEY")),
    }
    
    return func.HttpResponse(
        json.dumps(status),
        mimetype="application/json"
    )
