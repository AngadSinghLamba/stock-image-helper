"""URL builders for stock image platforms."""

from urllib.parse import quote_plus


def build_getty_url(query: str) -> str:
    """Build Getty Images search URL."""
    encoded = quote_plus(query)
    return f"https://www.gettyimages.com/search/2/image?phrase={encoded}"


def build_shutterstock_url(query: str) -> str:
    """Build Shutterstock search URL."""
    # Shutterstock uses hyphens in URL path
    slug = query.lower().replace(" ", "-")
    return f"https://www.shutterstock.com/search/{slug}"


def build_adobe_url(query: str) -> str:
    """Build Adobe Stock search URL."""
    encoded = quote_plus(query)
    return f"https://stock.adobe.com/search?k={encoded}"


def build_unsplash_url(query: str) -> str:
    """Build Unsplash search URL."""
    # Unsplash uses hyphens in URL path
    slug = query.lower().replace(" ", "-")
    return f"https://unsplash.com/s/photos/{slug}"


def build_pexels_url(query: str) -> str:
    """Build Pexels search URL."""
    # Pexels uses hyphens in URL path
    slug = query.lower().replace(" ", "-")
    return f"https://www.pexels.com/search/{slug}/"


# Platform URL builder mapping
URL_BUILDERS = {
    "getty": build_getty_url,
    "shutterstock": build_shutterstock_url,
    "adobe": build_adobe_url,
    "unsplash": build_unsplash_url,
    "pexels": build_pexels_url,
}


def build_url(query: str, platform: str) -> str:
    """Build search URL for the given platform."""
    builder = URL_BUILDERS.get(platform.lower())
    if builder:
        return builder(query)
    return ""
