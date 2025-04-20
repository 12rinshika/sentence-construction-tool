const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:3001/questions');
      return await res.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };
  
  export default fetchQuestions;
  