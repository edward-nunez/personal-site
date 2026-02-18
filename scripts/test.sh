curl -X POST http://localhost:3001/api/assess/job-fit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjczZDEwZjQwLWE3ZDctNGNhZC1hNWQ4LWExMDdlMzExYjViZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVkd2FyZG51bmV6LmNvbSIsImlhdCI6MTc3MTI5NTg4MSwiZXhwIjoxNzcxOTAwNjgxfQ.m_Vyft9hcBaP4ciGxCBcG9NzSfOupAHgQWYb7e98W0A" \    
  -H "Content-Type: application/json" \
  -d '{
   "jobTitle": "Senior DevOps Engineer",
   "jobDescription": "We're looking for...",
   "company": "Tech Corp",
   "requiredSkills": ["Kubernetes", "AWS"],
   "yearsExperience": 5,
   "location": "Remote",
   "type": "full-time"
 }'


echo -n "your-jwt-secret-change-in-production" | base64