import ExamResult from '../models/ExamResult.js';

export default class ExamService {
  static async calculateClassAverage(examId) {
    const results = await ExamResult.getResultsByExam(examId);
    const total = results.reduce((sum, res) => sum + res.score, 0);
    return total / results.length;
  }

  static async generateGradeDistribution(examId) {
    const results = await ExamResult.getResultsByExam(examId);
    return {
      A: results.filter(r => r.score >= 90).length,
      B: results.filter(r => r.score >= 80 && r.score < 90).length,
      
      // ... other grade bands
    };
  }

  static async cacheExamStats(examId) {
    const stats = await this.calculateClassAverage(examId);
    await cache.set(`exam:${examId}:stats`, stats, 3600); // Cache for 1 hour
  }
}