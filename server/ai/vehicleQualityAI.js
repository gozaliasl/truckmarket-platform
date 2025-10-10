/**
 * AI-Powered Vehicle Quality Assessment
 * Advanced quality evaluation and condition analysis
 */

const axios = require('axios');

class VehicleQualityAI {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.qualityThresholds = {
      excellent: 0.9,
      good: 0.75,
      fair: 0.6,
      poor: 0.4
    };
  }

  /**
   * Comprehensive Vehicle Quality Assessment
   */
  async assessVehicleQuality(vehicleData, images = [], maintenanceHistory = []) {
    try {
      // 1. Visual Inspection Analysis
      const visualAssessment = await this.analyzeVisualCondition(images, vehicleData);
      
      // 2. Mechanical Condition Analysis
      const mechanicalAssessment = await this.analyzeMechanicalCondition(vehicleData, maintenanceHistory);
      
      // 3. Market Value Impact Analysis
      const marketImpact = await this.analyzeMarketValueImpact(vehicleData, visualAssessment, mechanicalAssessment);
      
      // 4. Risk Assessment
      const riskAssessment = await this.assessVehicleRisks(vehicleData, maintenanceHistory);
      
      // 5. Overall Quality Score
      const overallScore = this.calculateOverallQualityScore({
        visual: visualAssessment,
        mechanical: mechanicalAssessment,
        market: marketImpact,
        risk: riskAssessment
      });

      return {
        overall_quality_score: overallScore.score,
        quality_grade: overallScore.grade,
        visual_condition: visualAssessment,
        mechanical_condition: mechanicalAssessment,
        market_impact: marketImpact,
        risk_assessment: riskAssessment,
        recommendations: this.generateQualityRecommendations(overallScore, visualAssessment, mechanicalAssessment),
        quality_report: await this.generateQualityReport(vehicleData, overallScore)
      };
    } catch (error) {
      console.error('Vehicle quality assessment error:', error);
      throw error;
    }
  }

  /**
   * Visual Condition Analysis using AI
   */
  async analyzeVisualCondition(images, vehicleData) {
    if (!images || images.length === 0) {
      return {
        score: 0.7, // Default score when no images
        grade: 'unknown',
        details: 'No images provided for visual assessment',
        confidence: 0.3
      };
    }

    try {
      // Analyze each image with AI
      const imageAnalyses = await Promise.all(
        images.map(image => this.analyzeImageWithAI(image, vehicleData))
      );

      // Combine analyses
      const combinedScore = imageAnalyses.reduce((sum, analysis) => sum + analysis.score, 0) / imageAnalyses.length;
      const issues = imageAnalyses.flatMap(analysis => analysis.issues);
      const strengths = imageAnalyses.flatMap(analysis => analysis.strengths);

      return {
        score: combinedScore,
        grade: this.getQualityGrade(combinedScore),
        details: this.generateVisualDetails(issues, strengths),
        issues: issues,
        strengths: strengths,
        confidence: 0.85,
        image_count: images.length
      };
    } catch (error) {
      console.error('Visual analysis error:', error);
      return {
        score: 0.5,
        grade: 'unknown',
        details: 'Unable to analyze images',
        confidence: 0.1
      };
    }
  }

  /**
   * Analyze individual image with AI
   */
  async analyzeImageWithAI(imageUrl, vehicleData) {
    const prompt = `
    Analyze this vehicle image for quality assessment:
    
    Vehicle Details:
    - Brand: ${vehicleData.brand}
    - Model: ${vehicleData.model}
    - Year: ${vehicleData.year}
    - Mileage: ${vehicleData.mileage} km
    
    Please assess:
    1. Exterior condition (paint, bodywork, rust, dents)
    2. Interior condition (seats, dashboard, wear)
    3. Overall maintenance appearance
    4. Any visible damage or issues
    5. Signs of good maintenance
    
    Rate each aspect from 0-1 and provide specific observations.
    `;

    try {
      const response = await this.callOpenAIWithImage(prompt, imageUrl);
      return this.parseImageAnalysis(response);
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        score: 0.5,
        issues: ['Unable to analyze image'],
        strengths: []
      };
    }
  }

  /**
   * Mechanical Condition Analysis
   */
  async analyzeMechanicalCondition(vehicleData, maintenanceHistory) {
    const analysis = {
      engine_condition: this.assessEngineCondition(vehicleData, maintenanceHistory),
      transmission_condition: this.assessTransmissionCondition(vehicleData, maintenanceHistory),
      brake_condition: this.assessBrakeCondition(vehicleData, maintenanceHistory),
      suspension_condition: this.assessSuspensionCondition(vehicleData, maintenanceHistory),
      electrical_condition: this.assessElectricalCondition(vehicleData, maintenanceHistory)
    };

    const overallScore = Object.values(analysis).reduce((sum, component) => sum + component.score, 0) / Object.keys(analysis).length;

    return {
      overall_score: overallScore,
      grade: this.getQualityGrade(overallScore),
      components: analysis,
      maintenance_score: this.calculateMaintenanceScore(maintenanceHistory),
      recommendations: this.generateMechanicalRecommendations(analysis)
    };
  }

  /**
   * Assess Engine Condition
   */
  assessEngineCondition(vehicleData, maintenanceHistory) {
    let score = 0.7; // Base score
    
    // Age factor
    const age = new Date().getFullYear() - vehicleData.year;
    if (age > 10) score -= 0.2;
    else if (age < 5) score += 0.1;
    
    // Mileage factor
    const mileagePerYear = vehicleData.mileage / Math.max(1, age);
    if (mileagePerYear > 100000) score -= 0.2;
    else if (mileagePerYear < 50000) score += 0.1;
    
    // Maintenance factor
    const engineMaintenance = maintenanceHistory.filter(m => 
      m.type.includes('engine') || m.type.includes('oil') || m.type.includes('filter')
    );
    if (engineMaintenance.length > 5) score += 0.1;
    
    // Euro standard factor
    if (vehicleData.euro_standard === 'Euro 6') score += 0.1;
    
    return {
      score: Math.max(0, Math.min(1, score)),
      factors: {
        age_impact: age > 10 ? 'negative' : age < 5 ? 'positive' : 'neutral',
        mileage_impact: mileagePerYear > 100000 ? 'negative' : mileagePerYear < 50000 ? 'positive' : 'neutral',
        maintenance_impact: engineMaintenance.length > 5 ? 'positive' : 'neutral'
      }
    };
  }

  /**
   * Assess Transmission Condition
   */
  assessTransmissionCondition(vehicleData, maintenanceHistory) {
    let score = 0.7;
    
    // Transmission type factor
    if (vehicleData.transmission === 'Automatic') score += 0.1;
    
    // Maintenance factor
    const transmissionMaintenance = maintenanceHistory.filter(m => 
      m.type.includes('transmission') || m.type.includes('gearbox')
    );
    if (transmissionMaintenance.length > 2) score += 0.1;
    
    // Mileage factor
    if (vehicleData.mileage > 500000) score -= 0.2;
    
    return {
      score: Math.max(0, Math.min(1, score)),
      factors: {
        type_impact: vehicleData.transmission === 'Automatic' ? 'positive' : 'neutral',
        maintenance_impact: transmissionMaintenance.length > 2 ? 'positive' : 'neutral',
        mileage_impact: vehicleData.mileage > 500000 ? 'negative' : 'neutral'
      }
    };
  }

  /**
   * Assess Brake Condition
   */
  assessBrakeCondition(vehicleData, maintenanceHistory) {
    let score = 0.7;
    
    // Maintenance factor
    const brakeMaintenance = maintenanceHistory.filter(m => 
      m.type.includes('brake') || m.type.includes('disc') || m.type.includes('pad')
    );
    if (brakeMaintenance.length > 3) score += 0.2;
    
    // Mileage factor
    if (vehicleData.mileage > 400000) score -= 0.1;
    
    return {
      score: Math.max(0, Math.min(1, score)),
      factors: {
        maintenance_impact: brakeMaintenance.length > 3 ? 'positive' : 'neutral',
        mileage_impact: vehicleData.mileage > 400000 ? 'negative' : 'neutral'
      }
    };
  }

  /**
   * Assess Suspension Condition
   */
  assessSuspensionCondition(vehicleData, maintenanceHistory) {
    let score = 0.7;
    
    // Maintenance factor
    const suspensionMaintenance = maintenanceHistory.filter(m => 
      m.type.includes('suspension') || m.type.includes('shock') || m.type.includes('spring')
    );
    if (suspensionMaintenance.length > 2) score += 0.1;
    
    // Mileage factor
    if (vehicleData.mileage > 600000) score -= 0.2;
    
    return {
      score: Math.max(0, Math.min(1, score)),
      factors: {
        maintenance_impact: suspensionMaintenance.length > 2 ? 'positive' : 'neutral',
        mileage_impact: vehicleData.mileage > 600000 ? 'negative' : 'neutral'
      }
    };
  }

  /**
   * Assess Electrical Condition
   */
  assessElectricalCondition(vehicleData, maintenanceHistory) {
    let score = 0.7;
    
    // Age factor (electrical systems degrade with age)
    const age = new Date().getFullYear() - vehicleData.year;
    if (age > 8) score -= 0.1;
    
    // Maintenance factor
    const electricalMaintenance = maintenanceHistory.filter(m => 
      m.type.includes('electrical') || m.type.includes('battery') || m.type.includes('alternator')
    );
    if (electricalMaintenance.length > 2) score += 0.1;
    
    return {
      score: Math.max(0, Math.min(1, score)),
      factors: {
        age_impact: age > 8 ? 'negative' : 'neutral',
        maintenance_impact: electricalMaintenance.length > 2 ? 'positive' : 'neutral'
      }
    };
  }

  /**
   * Market Value Impact Analysis
   */
  async analyzeMarketValueImpact(vehicleData, visualAssessment, mechanicalAssessment) {
    const prompt = `
    Analyze the market value impact for this vehicle based on its condition:
    
    Vehicle: ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
    Mileage: ${vehicleData.mileage} km
    
    Visual Condition Score: ${visualAssessment.score}
    Mechanical Condition Score: ${mechanicalAssessment.overall_score}
    
    Assess:
    1. How condition affects market value
    2. Price adjustment recommendations
    3. Market positioning advice
    4. Buyer appeal factors
    `;

    try {
      const response = await this.callOpenAI(prompt);
      
      // Calculate price impact
      const conditionScore = (visualAssessment.score + mechanicalAssessment.overall_score) / 2;
      const priceMultiplier = 0.7 + (conditionScore * 0.3); // 0.7 to 1.0 range
      
      return {
        price_impact: priceMultiplier,
        price_adjustment: (priceMultiplier - 1) * 100, // Percentage
        market_positioning: this.determineMarketPositioning(conditionScore),
        buyer_appeal: this.assessBuyerAppeal(conditionScore, vehicleData),
        ai_insights: response
      };
    } catch (error) {
      console.error('Market impact analysis error:', error);
      return {
        price_impact: 0.85,
        price_adjustment: -15,
        market_positioning: 'competitive',
        buyer_appeal: 'moderate'
      };
    }
  }

  /**
   * Risk Assessment
   */
  async assessVehicleRisks(vehicleData, maintenanceHistory) {
    const risks = [];
    let riskScore = 0.3; // Base risk score (0 = no risk, 1 = high risk)
    
    // High mileage risk
    if (vehicleData.mileage > 600000) {
      risks.push({
        type: 'high_mileage',
        severity: 'medium',
        description: 'Very high mileage may indicate increased maintenance needs',
        mitigation: 'Request detailed maintenance history and recent inspections'
      });
      riskScore += 0.2;
    }
    
    // Age risk
    const age = new Date().getFullYear() - vehicleData.year;
    if (age > 12) {
      risks.push({
        type: 'vehicle_age',
        severity: 'medium',
        description: 'Older vehicle may have age-related issues',
        mitigation: 'Check for rust, electrical issues, and component wear'
      });
      riskScore += 0.15;
    }
    
    // Maintenance history risk
    if (maintenanceHistory.length < 3) {
      risks.push({
        type: 'limited_maintenance_history',
        severity: 'high',
        description: 'Limited maintenance records available',
        mitigation: 'Request comprehensive inspection before purchase'
      });
      riskScore += 0.25;
    }
    
    // Brand reliability risk
    const unreliableBrands = ['Iveco', 'Renault']; // Simplified list
    if (unreliableBrands.includes(vehicleData.brand)) {
      risks.push({
        type: 'brand_reliability',
        severity: 'low',
        description: 'Brand may have higher maintenance costs',
        mitigation: 'Research brand-specific issues and maintenance costs'
      });
      riskScore += 0.1;
    }
    
    return {
      overall_risk_score: Math.min(1, riskScore),
      risk_level: this.getRiskLevel(riskScore),
      risks: risks,
      recommendations: this.generateRiskMitigationRecommendations(risks)
    };
  }

  /**
   * Calculate Overall Quality Score
   */
  calculateOverallQualityScore(assessments) {
    const weights = {
      visual: 0.3,
      mechanical: 0.4,
      market: 0.2,
      risk: 0.1
    };
    
    const visualScore = assessments.visual.score;
    const mechanicalScore = assessments.mechanical.overall_score;
    const marketScore = assessments.market.price_impact;
    const riskScore = 1 - assessments.risk.overall_risk_score; // Invert risk to quality
    
    const overallScore = (
      visualScore * weights.visual +
      mechanicalScore * weights.mechanical +
      marketScore * weights.market +
      riskScore * weights.risk
    );
    
    return {
      score: overallScore,
      grade: this.getQualityGrade(overallScore),
      breakdown: {
        visual: visualScore,
        mechanical: mechanicalScore,
        market: marketScore,
        risk: riskScore
      }
    };
  }

  /**
   * Generate Quality Recommendations
   */
  generateQualityRecommendations(overallScore, visualAssessment, mechanicalAssessment) {
    const recommendations = [];
    
    if (overallScore.score < 0.6) {
      recommendations.push({
        type: 'condition_improvement',
        priority: 'high',
        message: 'Consider addressing major issues before listing to improve marketability',
        actions: ['Fix visible damage', 'Complete major maintenance', 'Professional inspection']
      });
    }
    
    if (visualAssessment.score < 0.7) {
      recommendations.push({
        type: 'visual_improvement',
        priority: 'medium',
        message: 'Visual improvements can significantly increase buyer interest',
        actions: ['Clean and detail vehicle', 'Fix minor cosmetic issues', 'Professional photography']
      });
    }
    
    if (mechanicalAssessment.overall_score < 0.7) {
      recommendations.push({
        type: 'mechanical_improvement',
        priority: 'high',
        message: 'Mechanical issues should be addressed for optimal pricing',
        actions: ['Complete pending maintenance', 'Address mechanical issues', 'Get professional assessment']
      });
    }
    
    return recommendations;
  }

  /**
   * Generate Quality Report
   */
  async generateQualityReport(vehicleData, overallScore) {
    const prompt = `
    Generate a comprehensive quality report for this vehicle:
    
    Vehicle: ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
    Mileage: ${vehicleData.mileage} km
    Overall Quality Score: ${overallScore.score} (${overallScore.grade})
    
    Create a professional report including:
    1. Executive summary
    2. Key strengths
    3. Areas for improvement
    4. Market positioning
    5. Recommendations for seller
    6. Information for potential buyers
    `;

    try {
      const report = await this.callOpenAI(prompt);
      return report;
    } catch (error) {
      console.error('Quality report generation error:', error);
      return 'Unable to generate quality report at this time.';
    }
  }

  // Helper methods
  getQualityGrade(score) {
    if (score >= this.qualityThresholds.excellent) return 'excellent';
    if (score >= this.qualityThresholds.good) return 'good';
    if (score >= this.qualityThresholds.fair) return 'fair';
    return 'poor';
  }

  getRiskLevel(riskScore) {
    if (riskScore >= 0.7) return 'high';
    if (riskScore >= 0.4) return 'medium';
    return 'low';
  }

  calculateMaintenanceScore(maintenanceHistory) {
    if (!maintenanceHistory || maintenanceHistory.length === 0) return 0.3;
    
    const recentMaintenance = maintenanceHistory.filter(m => {
      const maintenanceDate = new Date(m.date);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return maintenanceDate > sixMonthsAgo;
    });
    
    return Math.min(1, 0.3 + (recentMaintenance.length * 0.1));
  }

  generateVisualDetails(issues, strengths) {
    let details = '';
    
    if (strengths.length > 0) {
      details += `Strengths: ${strengths.join(', ')}. `;
    }
    
    if (issues.length > 0) {
      details += `Issues noted: ${issues.join(', ')}.`;
    }
    
    return details || 'No specific visual issues or strengths identified.';
  }

  generateMechanicalRecommendations(analysis) {
    const recommendations = [];
    
    Object.entries(analysis).forEach(([component, assessment]) => {
      if (component !== 'overall_score' && component !== 'grade' && component !== 'maintenance_score') {
        if (assessment.score < 0.6) {
          recommendations.push({
            component: component.replace('_condition', ''),
            priority: 'high',
            message: `${component} may need attention`,
            score: assessment.score
          });
        }
      }
    });
    
    return recommendations;
  }

  determineMarketPositioning(conditionScore) {
    if (conditionScore >= 0.8) return 'premium';
    if (conditionScore >= 0.6) return 'competitive';
    return 'budget';
  }

  assessBuyerAppeal(conditionScore, vehicleData) {
    let appeal = 'moderate';
    
    if (conditionScore >= 0.8) appeal = 'high';
    else if (conditionScore < 0.5) appeal = 'low';
    
    // Adjust based on vehicle characteristics
    if (vehicleData.mileage < 200000) appeal = 'high';
    if (vehicleData.year >= 2018) appeal = 'high';
    
    return appeal;
  }

  generateRiskMitigationRecommendations(risks) {
    return risks.map(risk => ({
      risk_type: risk.type,
      recommendation: risk.mitigation,
      priority: risk.severity
    }));
  }

  parseImageAnalysis(aiResponse) {
    // Parse AI response to extract structured data
    // This is a simplified parser - in production, use more sophisticated NLP
    const scoreMatch = aiResponse.match(/score[:\s]*([0-9.]+)/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0.7;
    
    const issues = [];
    const strengths = [];
    
    if (aiResponse.toLowerCase().includes('rust')) issues.push('rust');
    if (aiResponse.toLowerCase().includes('dent')) issues.push('dents');
    if (aiResponse.toLowerCase().includes('scratch')) issues.push('scratches');
    if (aiResponse.toLowerCase().includes('clean')) strengths.push('clean exterior');
    if (aiResponse.toLowerCase().includes('well maintained')) strengths.push('well maintained');
    
    return {
      score: Math.max(0, Math.min(1, score)),
      issues: issues,
      strengths: strengths
    };
  }

  async callOpenAI(prompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert vehicle quality assessor. Provide detailed, accurate assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Unable to analyze vehicle quality at this time.';
    }
  }

  async callOpenAIWithImage(prompt, imageUrl) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert vehicle quality assessor. Analyze images for vehicle condition.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Vision API error:', error);
      return 'Unable to analyze image at this time.';
    }
  }
}

module.exports = VehicleQualityAI;
