
const fetchQuestions = async () => {
    try {
      const res = await fetch('/questions.json');
      const data = await res.json();
      return data.questions || []; // extract questions array
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };
  
  export default fetchQuestions;
  