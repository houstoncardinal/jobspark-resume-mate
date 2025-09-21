// Test job search functionality
const testJobSearch = async () => {
  try {
    const response = await fetch('http://localhost:8081/src/lib/job-aggregator.ts');
    if (response.ok) {
      console.log('✅ Job aggregator module is accessible');
    } else {
      console.log('❌ Job aggregator module not accessible');
    }
  } catch (error) {
    console.log('❌ Error accessing job aggregator:', error.message);
  }
};

testJobSearch();
