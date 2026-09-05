# app/services/classifier.py

import re
from typing import Dict


DOMAIN_KEYWORDS = {
    "Irrigation & Water Management": [
        "irrigation",
        "irrigation canal",
        "canal",
        "canal damaged",
        "canal blockage",
        "water channel",
        "farm water",
        "agricultural water",
        "water distribution",
        "irrigation pump",
        "water pump",
        "sprinkler",
        "drip irrigation",
        "drip system",
        "water for crops",
        "field water",
        "farm water supply",
        "irrigation pipeline",
        "irrigation pipe",
        "check dam",
        "water reservoir",
        "farm pond",
        "lift irrigation",
    ],

    "Drainage & Flooding": [
        "drainage",
        "drain",
        "blocked drain",
        "drain blockage",
        "storm water",
        "rainwater drainage",
        "waterlogging",
        "water logging",
        "flooding",
        "flood",
        "flooded road",
        "urban flooding",
        "drain overflow",
        "sewer overflow",
        "rain water accumulation",
        "standing water",
    ],

    "Drinking Water": [
        "drinking water",
        "safe drinking water",
        "water supply",
        "tap water",
        "water pipeline",
        "water pipe",
        "broken water pipe",
        "water tank",
        "water tanker",
        "hand pump",
        "borewell",
        "bore well",
        "water quality",
        "contaminated water",
        "dirty water",
        "water shortage",
        "no drinking water",
        "village water supply",
    ],

    "Sanitation & Waste": [
        "garbage",
        "waste",
        "solid waste",
        "waste collection",
        "garbage collection",
        "dumping",
        "open dumping",
        "landfill",
        "plastic waste",
        "sewage",
        "sewerage",
        "toilet",
        "sanitation",
        "open defecation",
        "dirty surroundings",
        "waste management",
    ],

    "Roads & Transport": [
        "road",
        "roads",
        "pothole",
        "potholes",
        "damaged road",
        "broken road",
        "road damage",
        "bridge",
        "culvert",
        "traffic",
        "bus service",
        "public transport",
        "transport",
        "road connectivity",
        "village road",
        "highway",
    ],

    "Education": [
        "school",
        "college",
        "university",
        "student",
        "students",
        "teacher",
        "teachers",
        "classroom",
        "education",
        "learning",
        "textbook",
        "school building",
        "school infrastructure",
        "scholarship",
        "exam",
        "laboratory",
        "library",
        "digital classroom",
    ],

    "Healthcare": [
        "hospital",
        "healthcare",
        "health care",
        "clinic",
        "doctor",
        "doctors",
        "nurse",
        "nurses",
        "medicine",
        "medicines",
        "medical",
        "health centre",
        "health center",
        "ambulance",
        "patient",
        "patients",
        "health service",
        "primary health centre",
        "phc",
    ],

    "Electricity & Energy": [
        "electricity",
        "power supply",
        "power cut",
        "power outage",
        "electric pole",
        "electric poles",
        "transformer",
        "street light",
        "streetlights",
        "solar power",
        "solar panel",
        "energy",
        "electric connection",
        "electric line",
        "power line",
    ],

    "Environment & Water Bodies": [
        "pollution",
        "air pollution",
        "water pollution",
        "environment",
        "environmental",
        "river pollution",
        "lake pollution",
        "pond pollution",
        "deforestation",
        "forest degradation",
        "plastic pollution",
        "biodiversity",
        "wildlife",
        "wetland",
        "river",
        "lake",
        "pond",
    ],

    "Livelihoods & Employment": [
        "employment",
        "job",
        "jobs",
        "unemployment",
        "livelihood",
        "income",
        "skill training",
        "vocational training",
        "self employment",
        "self-employment",
        "business opportunity",
        "small business",
        "entrepreneur",
        "entrepreneurship",
        "market access",
    ],

    "Accessibility": [
        "disability",
        "disabled",
        "wheelchair",
        "accessible",
        "accessibility",
        "blind",
        "visually impaired",
        "hearing impaired",
        "ramps",
        "ramp",
        "special needs",
        "persons with disabilities",
    ],

    "Government & Digital Services": [
        "government service",
        "government office",
        "government scheme",
        "government portal",
        "online service",
        "digital service",
        "certificate",
        "birth certificate",
        "death certificate",
        "ration card",
        "pension",
        "welfare scheme",
        "application",
        "online application",
        "official document",
        "public service",
    ],

    "Urban Infrastructure": [
        "urban infrastructure",
        "municipality",
        "municipal",
        "town infrastructure",
        "street infrastructure",
        "footpath",
        "sidewalk",
        "public park",
        "urban area",
        "city infrastructure",
    ],

    "Public Safety": [
        "crime",
        "safety",
        "unsafe",
        "police",
        "security",
        "street crime",
        "women safety",
        "women's safety",
        "cctv",
        "surveillance",
        "accident",
        "dangerous area",
        "emergency",
    ],

    "Disaster Management": [
        "disaster",
        "disaster management",
        "emergency response",
        "earthquake",
        "landslide",
        "cyclone",
        "drought",
        "disaster preparedness",
        "relief",
        "rescue",
        "evacuation",
        "emergency shelter",
    ],

    "Digital Connectivity": [
        "internet",
        "internet connectivity",
        "network",
        "mobile network",
        "mobile connectivity",
        "4g",
        "5g",
        "broadband",
        "wifi",
        "wi-fi",
        "telecom",
        "digital connectivity",
        "poor network",
        "no network",
    ],

    "Housing & Basic Amenities": [
        "housing",
        "house",
        "home",
        "shelter",
        "roof",
        "damaged house",
        "housing scheme",
        "basic amenities",
        "living conditions",
        "house construction",
    ],

    "Water Resources & Conservation": [
        "water conservation",
        "water harvesting",
        "rainwater harvesting",
        "groundwater",
        "ground water",
        "water table",
        "water recharge",
        "aquifer",
        "watershed",
        "water resource",
        "water resources",
        "groundwater depletion",
        "water scarcity",
        "conservation pond",
    ],

    "Agriculture": [
        "agriculture",
        "agricultural",
        "farmer",
        "farmers",
        "farming",
        "crop",
        "crops",
        "cultivation",
        "cultivator",
        "fertilizer",
        "fertiliser",
        "seed",
        "seeds",
        "pesticide",
        "pest",
        "harvest",
        "harvesting",
        "soil",
        "soil health",
        "crop disease",
        "agricultural machinery",
        "farm equipment",
        "livestock",
        "cattle",
        "dairy farming",
    ],
}


# Higher priority = more specific domain.
DOMAIN_PRIORITY = [
    "Irrigation & Water Management",
    "Drainage & Flooding",
    "Drinking Water",
    "Sanitation & Waste",
    "Roads & Transport",
    "Education",
    "Healthcare",
    "Electricity & Energy",
    "Environment & Water Bodies",
    "Livelihoods & Employment",
    "Accessibility",
    "Government & Digital Services",
    "Urban Infrastructure",
    "Public Safety",
    "Disaster Management",
    "Digital Connectivity",
    "Housing & Basic Amenities",
    "Water Resources & Conservation",
    "Agriculture",
]


def normalize_text(text: str) -> str:
    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s\-]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def keyword_score(text: str, keyword: str) -> int:
    keyword = normalize_text(keyword)

    if not keyword:
        return 0

    # Multi-word phrases receive a stronger score.
    if " " in keyword:
        if keyword in text:
            return 4

        return 0

    pattern = rf"\b{re.escape(keyword)}\b"

    return len(
        re.findall(pattern, text)
    )


def classify_problem(
    title: str,
    description: str
) -> Dict:

    title = title or ""
    description = description or ""

    title_text = normalize_text(title)
    description_text = normalize_text(description)

    combined_text = f"{title_text} {description_text}"

    scores = {}

    # Calculate score for every domain.
    for domain, keywords in DOMAIN_KEYWORDS.items():

        score = 0

        for keyword in keywords:

            # Title is given double importance.
            title_score = keyword_score(
                title_text,
                keyword
            )

            description_score = keyword_score(
                description_text,
                keyword
            )

            score += title_score * 2
            score += description_score

        scores[domain] = score

    # Keep only domains that received evidence.
    non_zero_scores = {
        domain: score
        for domain, score in scores.items()
        if score > 0
    }

    # Nothing matched.
    if not non_zero_scores:

        return {
            "domain": "Other",
            "confidence": 0.20,
            "scores": scores
        }

    max_score = max(
        non_zero_scores.values()
    )

    # Domains having the highest score.
    candidates = [
        domain
        for domain, score in non_zero_scores.items()
        if score == max_score
    ]

    # Resolve ties using domain priority.
    selected_domain = None

    for domain in DOMAIN_PRIORITY:

        if domain in candidates:
            selected_domain = domain
            break

    if selected_domain is None:
        selected_domain = candidates[0]

    total_score = sum(
        non_zero_scores.values()
    )

    confidence = max_score / total_score

    # Strong phrases increase confidence.
    strong_specific_phrases = [
        "irrigation canal",
        "drip irrigation",
        "irrigation pump",
        "blocked drain",
        "drainage",
        "drinking water",
        "water supply",
        "garbage collection",
        "power outage",
        "waterlogging",
        "internet connectivity",
        "rainwater harvesting",
    ]

    phrase_found = any(
        phrase in combined_text
        for phrase in strong_specific_phrases
    )

    if phrase_found:
        confidence += 0.15

    confidence = min(
        max(confidence, 0.20),
        0.99
    )

    return {
        "domain": selected_domain,
        "confidence": round(confidence, 2),
        "scores": scores
    }