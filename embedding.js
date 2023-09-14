

// Call OpenAI API
export async function getEmbeddings(titles) {
    // Configure request  
    const url = apiUrl;
    const headers = {
	  'content-Type': 'application/json',
      'api-key': apiKey
    };

    // Build request body
    const body = JSON.stringify({
      input: titles
    });
  
	return fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    })
    .then(response => {
      if(response.ok) {
        return response.json();  
      }
      throw new Error('Request failed');
    })
    .then(respj => respj.data)
    .catch(err => {
      throw err;
    })
}

function dotp(x, y) {
  function dotp_sum(a, b) {
    return a + b;
  }
  function dotp_times(a, i) {
    return x[i] * y[i];
  }
  return x.map(dotp_times).reduce(dotp_sum, 0);
}

export function cosineSimilarity(A,B){
  var similarity = dotp(A, B) / (Math.sqrt(dotp(A,A)) * Math.sqrt(dotp(B,B)));
  return similarity;
}

export function findMostSimilarIds(inputVector, vectors, topn=5) {
  const similarities = Object.entries(vectors).map(([id, item]) => {
    return {
      id,
      similarity: cosineSimilarity(inputVector, item.embedding)  
    };
  });
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0,topn).map(({id}) => id);
}