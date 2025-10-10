/**
 * AI Features Testing Script
 * Test all AI-powered features of the platform
 */

const AdvancedPricingAI = require('./ai/advancedPricingAI');
const VehicleQualityAI = require('./ai/vehicleQualityAI');
const AdvancedNLP = require('./ai/advancedNLP');
const EnhancedChatbot = require('./ai/enhancedChatbot');

async function testAIFeatures() {
  console.log('🚀 Testing AI Features for Road Platform\n');

  try {
    // Test 1: Advanced Pricing AI
    console.log('1️⃣ Testing Advanced Pricing AI...');
    const pricingAI = new AdvancedPricingAI();
    
    const testVehicle = {
      brand: 'Mercedes-Benz',
      model: 'Actros',
      year: 2020,
      mileage: 350000,
      category: 'semi-trailer-trucks',
      features: ['retarder', 'adaptive_cruise'],
      euro_standard: 'Euro 6',
      condition: 'Used'
    };

    const pricePrediction = await pricingAI.predictVehiclePrice(testVehicle);
    console.log('✅ Price Prediction:', {
      predicted_price: `€${pricePrediction.predicted_price.toLocaleString()}`,
      confidence: `${(pricePrediction.confidence * 100).toFixed(1)}%`,
      price_range: `€${pricePrediction.price_range.min.toLocaleString()} - €${pricePrediction.price_range.max.toLocaleString()}`
    });

    // Test 2: Vehicle Quality Assessment
    console.log('\n2️⃣ Testing Vehicle Quality Assessment...');
    const qualityAI = new VehicleQualityAI();
    
    const qualityAssessment = await qualityAI.assessVehicleQuality(testVehicle, [], []);
    console.log('✅ Quality Assessment:', {
      overall_score: qualityAssessment.overall_quality_score,
      grade: qualityAssessment.quality_grade,
      visual_score: qualityAssessment.visual_condition.score,
      mechanical_score: qualityAssessment.mechanical_condition.overall_score
    });

    // Test 3: Advanced NLP
    console.log('\n3️⃣ Testing Advanced NLP...');
    const nlp = new AdvancedNLP();
    
    const testQuery = "I need a Mercedes truck under €50,000 with low mileage and Euro 6";
    const nlpResult = await nlp.understandQuery(testQuery);
    console.log('✅ NLP Analysis:', {
      intent: nlpResult.intent.intent,
      confidence: nlpResult.confidence,
      entities: {
        brands: nlpResult.entities.brands,
        price_ranges: nlpResult.entities.price_ranges,
        features: nlpResult.entities.features
      }
    });

    // Test 4: Enhanced Chatbot
    console.log('\n4️⃣ Testing Enhanced Chatbot...');
    const chatbot = new EnhancedChatbot();
    
    const chatbotResponse = await chatbot.processMessage('user123', testQuery, {});
    console.log('✅ Chatbot Response:', {
      message: chatbotResponse.message.substring(0, 100) + '...',
      intent: chatbotResponse.intent,
      confidence: chatbotResponse.confidence,
      suggestions_count: chatbotResponse.suggestions.length
    });

    // Test 5: Search Query Generation
    console.log('\n5️⃣ Testing Search Query Generation...');
    const searchQuery = await nlp.generateSearchQuery(nlpResult);
    console.log('✅ Generated Search Query:', {
      filters: searchQuery.filters,
      sort: searchQuery.sort,
      intent: searchQuery.intent
    });

    console.log('\n🎉 All AI Features Tested Successfully!');
    console.log('\n📊 AI System Summary:');
    console.log('   ✅ Advanced Pricing AI - Operational');
    console.log('   ✅ Vehicle Quality Assessment - Operational');
    console.log('   ✅ Natural Language Processing - Operational');
    console.log('   ✅ Enhanced Chatbot - Operational');
    console.log('   ✅ Search Query Generation - Operational');
    
    console.log('\n🚀 Your Road Platform is now powered by world-class AI!');

  } catch (error) {
    console.error('❌ AI Testing Error:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Ensure all API keys are set in .env file');
    console.log('   2. Check internet connection for external AI services');
    console.log('   3. Verify all dependencies are installed');
    console.log('   4. Run: npm install in server directory');
  }
}

// Run the tests
if (require.main === module) {
  testAIFeatures();
}

module.exports = testAIFeatures;
