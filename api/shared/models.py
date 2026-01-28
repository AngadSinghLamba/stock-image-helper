"""Pydantic models for request/response validation."""

from typing import List, Optional
from pydantic import BaseModel, Field


class SearchQuery(BaseModel):
    """A single search query for a stock image platform."""
    query: str = Field(description="The search query string")
    platform: str = Field(description="Platform: getty, shutterstock, adobe, unsplash, or pexels")
    url: str = Field(default="", description="Full search URL for the platform")
    reasoning: str = Field(description="Why this query is effective for finding the desired images")


class BriefAnalysis(BaseModel):
    """Analysis of the creative brief's visual elements."""
    subject: str = Field(description="Main subject of the image (e.g., 'pickup truck', 'woman working')")
    setting: str = Field(description="Environment or location (e.g., 'mountain landscape', 'modern office')")
    lighting: str = Field(description="Lighting conditions (e.g., 'golden hour', 'soft natural light')")
    mood: str = Field(description="Emotional tone or mood (e.g., 'adventurous', 'professional')")
    composition: str = Field(description="Framing and composition style (e.g., 'wide shot', 'close-up')")
    style: str = Field(description="Visual style (e.g., 'cinematic', 'editorial', 'lifestyle')")


class GenerateRequest(BaseModel):
    """Request body for query generation."""
    brief: str = Field(description="The creative brief describing desired images")
    model: str = Field(default="gpt-4o", description="LLM model to use")
    platforms: List[str] = Field(
        default=["getty", "shutterstock"],
        description="Stock platforms to generate queries for"
    )
    session_id: Optional[str] = Field(default=None, description="Session ID for conversation memory")


class GenerateResponse(BaseModel):
    """Response containing brief analysis and search queries."""
    brief_analysis: BriefAnalysis
    queries: List[SearchQuery]
    model_used: str = Field(description="The LLM model that was used")
