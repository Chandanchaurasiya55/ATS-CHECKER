export const analyzeATS = (data) => {
  // Logic to ensure min 91 score for builder as requested
  let score = 91;
  const suggestions = [];
  const issues = [];

  if (data.skills?.length < 10) {
    score += 2;
    suggestions.push("Add more relevant technical skills to broaden your profile.");
  } else {
    score += 4;
  }

  if (data.experience?.length < 2) {
    score += 1;
    suggestions.push("Include more professional experience or internship projects.");
  } else {
    score += 3;
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    atsScore: score,
    sectionScores: {
      format: 95,
      content: 90,
      keywords: 92,
      optimization: 88,
    },
    issues,
    suggestions,
    keywordsFound: data.skills || [],
    keywordsMissing: ["Microservices", "Docker", "AWS"],
    improvedText: "Consider using impact verbs like ' Spearheaded', 'Automated', or 'Reduced' in your experience descriptions."
  };
};

export const analyzeText = (text) => {
  // Basic text analysis for uploaded files
  const keywords = [
    "React", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript", 
    "Python", "Java", "SQL", "NoSQL", "Docker", "AWS", "Kubernetes",
    "Tailwind", "REST API", "GraphQL", "Redux", "Git", "CI/CD"
  ];
  
  const lowerText = text.toLowerCase();
  const found = keywords.filter(kw => lowerText.includes(kw.toLowerCase()));
  const missing = keywords.slice(0, 10).filter(kw => !lowerText.includes(kw.toLowerCase()));

  // Dynamic Scoring Logic
  let score = 50; // Base score
  
  // 1. Keyword Score (up to 30 points)
  score += Math.min(found.length * 3, 30);
  
  // 2. Length/Detail Check (up to 10 points)
  if (text.length > 1000) score += 10;
  else if (text.length > 500) score += 5;
  
  // 3. Formatting/Structure indicators (up to 10 points)
  if (lowerText.includes("education") || lowerText.includes("experience")) score += 5;
  if (lowerText.includes("skills") || lowerText.includes("projects")) score += 5;

  return {
    atsScore: Math.min(score, 100),
    sectionScores: {
      format: lowerText.includes("education") && lowerText.includes("experience") ? 90 : 60,
      content: text.length > 800 ? 85 : 55,
      keywords: Math.min(60 + (found.length * 4), 100),
      optimization: found.length > 5 ? 80 : 40,
    },
    issues: missing.length > 3 ? [`Missing several industry-standard keywords: ${missing.slice(0, 3).join(', ')}`] : ["Optimize your keyword density."],
    suggestions: [
      found.length < 5 ? "Add more technical skills relevant to your domain." : "Your skill variety is good.",
      text.length < 600 ? "Try to expand on your experience and achievements." : "Good detail in your professional experience.",
      "Ensure your contact information is clearly visible."
    ],
    keywordsFound: found,
    keywordsMissing: missing,
    improvedText: "Consider quantifying your achievements with numbers (e.g., 'Improved performance by 20%')."
  };
};
