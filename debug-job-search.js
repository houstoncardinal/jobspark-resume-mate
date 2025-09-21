// Debug job search functionality
console.log('Testing job search...');

// Test individual job sources
async function testJobSources() {
  console.log('Testing job sources...');
  
  // Test RemoteOK
  try {
    const response = await fetch('https://api.allorigins.win/raw?url=https://remoteok.io/api');
    const data = await response.json();
    console.log('✅ RemoteOK:', data.length, 'jobs available');
  } catch (error) {
    console.log('❌ RemoteOK error:', error.message);
  }
  
  // Test USAJobs
  try {
    const response = await fetch('https://data.usajobs.gov/api/search?Keyword=software&ResultsPerPage=5', {
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': 'Gigm8 Job Search Platform (contact@gigm8.com)',
        'Authorization-Key': '4Nx2nq6xUYvNNm8VZFm8rPR3M7/8j336/vLgujfroSU=',
      },
    });
    const data = await response.json();
    const jobCount = data.SearchResult?.SearchResultItems?.length || 0;
    console.log('✅ USAJobs:', jobCount, 'jobs found');
  } catch (error) {
    console.log('❌ USAJobs error:', error.message);
  }
}

// Run the test
testJobSources();
