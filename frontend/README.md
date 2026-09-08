# Sahaya Tech — Complete Citizen Module

Smart India Hackathon 2026 · Problem Statement 26043

## Included
- Citizen dashboard / home
- Weekly submission limit: 3 problem statements per citizen per week
- Weekly usage meter and Monday reset message
- Five-step challenge submission flow
- Natural-language title + description
- Citizen-selected priority
- Location: district, village/town/ward, specific location, landmark, optional device coordinates
- Photo/video evidence with a strict maximum of 3 combined files per problem statement
- Voice message recording with browser microphone + audio upload fallback
- Supporting document upload
- Community impact: affected population, groups and impact areas
- Review before submission
- Mock AI-assisted analysis: domain, category, priority assistance, duplicate candidates, jurisdiction and capabilities
- Challenge ID and submission success state
- My Challenges with full lifecycle timeline
- Community Challenges with search, filters and sorting
- Community support signal (explicitly not an automatic priority score)
- Challenge details, evidence summary and privacy information
- Notifications
- Citizen profile and submission policy
- Responsive mobile/tablet/desktop layouts

## Run
```bash
npm install
npm run dev
```

## Backend connection

Start the FastAPI backend before submitting a citizen problem statement:

```powershell
cd ../backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The frontend sends citizen submissions to `http://127.0.0.1:8000/api/problems`.
To use another backend URL, create `frontend/.env.local` with:

```text
VITE_API_URL=http://127.0.0.1:8000
```

## Prototype storage
Citizen submissions are stored in browser localStorage under `sahaya_citizen_submissions`.
Media files are previewed locally during the session; a production implementation should replace this with the planned file-storage/API layer.

## Weekly rule
The prototype constant is `CITIZEN_WEEKLY_LIMIT = 3`. The count is per citizen and uses Monday–Sunday weeks.

## Latest update: University + Citizen cleanup

### University module
- University Innovation Hub at `/university`.
- Validated problems needing implementation at `/university/problems`.
- Implemented/past problems at `/university/implemented`.
- Capability/profile completion at `/university/profile`.
- University registration at `/register/university` includes institutional details and separate document upload sections for past solved problems/projects, licenses & registrations, certifications, and awards/recognition.
- After registration, the confirmation view shows a 72% prototype profile-completion progress state.

### Citizen submission cleanup
The Citizen report flow no longer contains the Community Impact step or its affected-population/impact-area fields. The flow is now:
1. Describe
2. Location
3. Evidence
4. Review & Submit

Voice messages, supporting documents, and the maximum 3 combined photo/video evidence rule remain supported.
