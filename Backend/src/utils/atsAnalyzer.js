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
  const keywords = ["React", "Node.js", "MongoDB", "Express", "JavaScript", "REST API"];
  const found = keywords.filter(kw => text.toLowerCase().includes(kw.toLowerCase()));
  const missing = keywords.filter(kw => !text.toLowerCase().includes(kw.toLowerCase()));

  const score = 75 + (found.length * 4);

  return {
    atsScore: Math.min(score, 100),
    sectionScores: {
      format: 80,
      content: 75,
      keywords: 70 + (found.length * 5),
      optimization: 85,
    },
    issues: missing.length > 0 ? [`Missing key technologies: ${missing.join(', ')}`] : [],
    suggestions: [
      "Improve keyword density for specialized roles.",
      "Ensure contact information is clearly visible at the top."
    ],
    keywordsFound: found,
    keywordsMissing: missing,
    improvedText: "Try to incorporate more industry-standard terminology found in job descriptions."
  };
};
