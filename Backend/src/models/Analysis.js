import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: String,
    atsScore: Number,
    sectionScores: {
      format: Number,
      content: Number,
      keywords: Number,
      optimization: Number,
    },
    issues: [String],
    suggestions: [String],
    keywordsFound: [String],
    keywordsMissing: [String],
    improvedText: String,
  },
  { timestamps: true }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
