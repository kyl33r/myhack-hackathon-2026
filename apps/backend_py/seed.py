"""
One-time script to seed Firestore with mentors, programmes, partners,
a sample startup, and a sample linkage.

Usage:
    python seed.py

Requires:
    pip install firebase-admin
    serviceAccountKey.json in the same directory as this file
"""

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

MENTORS = [
    {
        "id": "mentor_001",
        "name": "Ahmad Razif",
        "initials": "AR",
        "expertise": ["fintech", "payments", "B2B SaaS"],
        "background": "Ex-Head of Product at MoneyLion, co-founder of payment startup acquired 2022",
        "industries": ["fintech", "financial services", "banking tech"],
        "stages": ["pre-seed", "seed", "series-a"],
        "mentored_count": 12,
        "availability": "2 sessions/month",
        "location": "Kuala Lumpur",
    },
    {
        "id": "mentor_002",
        "name": "Siti Liyana",
        "initials": "SL",
        "expertise": ["healthtech", "B2B SaaS", "growth"],
        "background": "Ex-Growth Lead at Grab Health, advisor to 3 MDEC-backed startups",
        "industries": ["healthtech", "medtech", "wellness"],
        "stages": ["seed", "series-a"],
        "mentored_count": 8,
        "availability": "4 sessions/month",
        "location": "Petaling Jaya",
    },
    {
        "id": "mentor_003",
        "name": "Raj Kumar",
        "initials": "RK",
        "expertise": ["deeptech", "AI/ML", "enterprise sales"],
        "background": "CTO at Fusionex, built ML platforms for Fortune 500 companies",
        "industries": ["deeptech", "AI", "enterprise software"],
        "stages": ["pre-seed", "seed"],
        "mentored_count": 6,
        "availability": "2 sessions/month",
        "location": "Cyberjaya",
    },
    {
        "id": "mentor_004",
        "name": "Nurul Ain",
        "initials": "NA",
        "expertise": ["edtech", "consumer apps", "go-to-market"],
        "background": "Co-founder of EduKhas (acquired by iflix), angel investor",
        "industries": ["edtech", "consumer tech", "marketplace"],
        "stages": ["pre-seed", "seed"],
        "mentored_count": 15,
        "availability": "2 sessions/month",
        "location": "Shah Alam",
    },
    {
        "id": "mentor_005",
        "name": "David Tan",
        "initials": "DT",
        "expertise": ["agritech", "IoT", "supply chain"],
        "background": "Ex-VP at AgroFresh, built agri-supply chain platform across SEA",
        "industries": ["agritech", "supply chain", "IoT"],
        "stages": ["seed", "series-a"],
        "mentored_count": 5,
        "availability": "1 session/month",
        "location": "Kota Bharu",
    },
]

PROGRAMMES = [
    {
        "id": "prog_001",
        "name": "Cradle CIP Accelerate",
        "type": "grant",
        "focus": ["fintech", "healthtech", "edtech", "agritech"],
        "funding": "RM150,000",
        "duration": "6 months",
        "benefits": ["funding", "mentorship", "investor access", "MDEC networking"],
        "next_intake": "August 2026",
        "eligible_stages": ["pre-seed", "seed"],
    },
    {
        "id": "prog_002",
        "name": "MDEC GAIN Programme",
        "type": "accelerator",
        "focus": ["deeptech", "AI", "fintech", "creative tech"],
        "funding": "USD 20,000 + soft landing support",
        "duration": "3 months",
        "benefits": ["global market access", "Silicon Valley mentors", "investor pitching"],
        "next_intake": "October 2026",
        "eligible_stages": ["seed", "series-a"],
    },
    {
        "id": "prog_003",
        "name": "Cradle CIP Spark",
        "type": "grant",
        "focus": ["any tech sector"],
        "funding": "RM75,000",
        "duration": "3 months",
        "benefits": ["early funding", "validation support", "Cradle network"],
        "next_intake": "July 2026",
        "eligible_stages": ["pre-seed"],
    },
    {
        "id": "prog_004",
        "name": "MaGIC Global Accelerator",
        "type": "accelerator",
        "focus": ["social enterprise", "sustainability", "impact tech"],
        "funding": "RM50,000 + in-kind",
        "duration": "4 months",
        "benefits": ["impact investor access", "regional SEA expansion", "sustainability certification"],
        "next_intake": "September 2026",
        "eligible_stages": ["pre-seed", "seed"],
    },
]

PARTNERS = [
    {
        "id": "partner_001",
        "name": "Mastercard Malaysia",
        "partner_type": "corporate",
        "industries": ["fintech", "payments", "financial inclusion", "e-commerce"],
        "offers": ["pilot opportunities", "co-branding", "API sandbox access", "market access"],
        "suitable_stages": ["seed", "series-a"],
        "engagement_type": "Technology partnership",
    },
    {
        "id": "partner_002",
        "name": "Telekom Malaysia (TM)",
        "partner_type": "corporate",
        "industries": ["deeptech", "IoT", "smart city", "connectivity"],
        "offers": ["infrastructure access", "enterprise pilots", "co-development", "TM ONE network"],
        "suitable_stages": ["seed", "series-a", "series-b"],
        "engagement_type": "Infrastructure + pilot partner",
    },
    {
        "id": "partner_003",
        "name": "KPJ Healthcare",
        "partner_type": "corporate",
        "industries": ["healthtech", "medtech", "wellness", "telemedicine"],
        "offers": ["clinical pilot access", "patient data (anonymised)", "hospital network", "co-branding"],
        "suitable_stages": ["pre-seed", "seed"],
        "engagement_type": "Clinical validation partner",
    },
    {
        "id": "partner_004",
        "name": "CIMB Bank",
        "partner_type": "corporate",
        "industries": ["fintech", "banking tech", "wealth management", "Islamic finance"],
        "offers": ["API banking sandbox", "regulatory fast-track", "co-innovation lab access"],
        "suitable_stages": ["seed", "series-a"],
        "engagement_type": "Banking infrastructure partner",
    },
    {
        "id": "partner_005",
        "name": "Axiata Digital",
        "partner_type": "corporate",
        "industries": ["edtech", "fintech", "digital payments", "connectivity"],
        "offers": ["Boost ecosystem integration", "rural market access", "co-marketing"],
        "suitable_stages": ["pre-seed", "seed"],
        "engagement_type": "Digital ecosystem partner",
    },
    {
        "id": "partner_inv_001",
        "name": "Openspace Ventures",
        "partner_type": "investor",
        "industries": ["fintech", "saas", "healthtech"],
        "investment_stage": ["seed", "series-a"],
        "ticket_size_min": 500000,
        "ticket_size_max": 3000000,
        "investment_thesis": "B2B tech with SEA expansion potential",
        "portfolio_companies": ["Funding Societies", "Doctor Anywhere"],
    },
    {
        "id": "partner_svc_001",
        "name": "Wong & Partners",
        "partner_type": "service_provider",
        "service_type": "legal",
        "offers": ["startup incorporation", "term sheet review", "IP filing"],
        "pricing_model": "discounted",
        "suitable_stages": ["pre-seed", "seed"],
    },
]

STARTUPS = [
    {
        "startup_id": "startup_001",
        "cofounder_name": "Hafiz Rahman",
        "startup_name": "PayEase",
        "industry": "fintech",
        "stage": "seed",
        "problem": "SMEs in Malaysia still use cash and manual invoicing for cross-border payments",
        "needs": ["mentorship", "market access", "funding"],
        "created_at": firestore.SERVER_TIMESTAMP,
    },
]

LINKAGES = [
    {
        "linkage_id": "lnk_20260516_001",
        "startup_id": "startup_001",
        "startup_name": "PayEase",
        "actor_type": "mentor",
        "partner_type": None,
        "actor_id": "mentor_001",
        "actor_name": "Ahmad Razif",
        "match_score": 92,
        "match_reason": "Ahmad's fintech and payment systems expertise directly aligns with PayEase's core product.",
        "status": "active",
        "created_at": firestore.SERVER_TIMESTAMP,
        "outcome": None,
    },
    {
        "linkage_id": "lnk_20260516_002",
        "startup_id": "startup_001",
        "startup_name": "PayEase",
        "actor_type": "programme",
        "partner_type": None,
        "actor_id": "prog_001",
        "actor_name": "Cradle CIP Accelerate",
        "match_score": 88,
        "match_reason": "PayEase meets all eligibility criteria and fintech is a focus sector for CIP Accelerate.",
        "status": "active",
        "created_at": firestore.SERVER_TIMESTAMP,
        "outcome": None,
    },
    {
        "linkage_id": "lnk_20260516_003",
        "startup_id": "startup_001",
        "startup_name": "PayEase",
        "actor_type": "partner",
        "partner_type": "corporate",
        "actor_id": "partner_001",
        "actor_name": "Mastercard Malaysia",
        "match_score": 85,
        "match_reason": "Mastercard's API sandbox and fintech pilot programme are a direct fit for PayEase's payment infrastructure needs.",
        "status": "pending",
        "created_at": firestore.SERVER_TIMESTAMP,
        "outcome": None,
    },
]


# ---------------------------------------------------------------------------
# Write to Firestore
# ---------------------------------------------------------------------------

def seed_collection(collection_name, records, id_field):
    col = db.collection(collection_name)
    for record in records:
        doc_id = record[id_field]
        col.document(doc_id).set(record)
        print(f"  {collection_name}/{doc_id}")


def main():
    print("Seeding mentors...")
    seed_collection("mentors", MENTORS, "id")

    print("Seeding programmes...")
    seed_collection("programmes", PROGRAMMES, "id")

    print("Seeding partners...")
    seed_collection("partners", PARTNERS, "id")

    print("Seeding startups...")
    seed_collection("startups", STARTUPS, "startup_id")

    print("Seeding linkages...")
    seed_collection("linkages", LINKAGES, "linkage_id")

    print("\nDone. All collections seeded.")


if __name__ == "__main__":
    main()
