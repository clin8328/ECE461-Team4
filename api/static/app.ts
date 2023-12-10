document.addEventListener('DOMContentLoaded', function () {
    let authToken: string;
  
    // Authentication
    const loginButton = document.getElementById('login-button') as HTMLButtonElement;
  
    if (loginButton) {
      loginButton.addEventListener('click', async function () {
        const username = prompt('Enter username:');
        const password = prompt('Enter password:');
  
        try {
          const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/authenticate', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              User: {
                name: username,
                isAdmin: true,
              },
              Secret: {
                password: password,
              },
            }, replacer),
          });
  
          if (response.ok) {
            authToken = await response.json();
            console.log('Login successful. Token:', authToken);
            localStorage.setItem('authToken', authToken);
          } else {
            console.error('Login failed:', response.status);
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      });
    }
    // Authentication End
  
    // Reset Registry
    const resetButton = document.getElementById('resetButton') as HTMLButtonElement;
  
    resetButton.addEventListener('click', async function () {
      const authToken = localStorage.getItem('authToken');
  
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        return;
      }
  
      try {
        const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/reset', {
          method: 'DELETE',
          headers: {
            'X-Authorization': authToken,
          },
        });
  
        if (response.ok) {
          console.log('Registry reset successful');
        } else {
          console.error('Registry reset failed:', response.status);
        }
      } catch (error) {
        console.error('Error resetting registry:', error);
      }
    });
    // Reset Registry End
  
    // Upload and Ingestion
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const urlInput = document.getElementById('urlInput') as HTMLInputElement;
    const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
  
    uploadButton.addEventListener('click', async function () {
      const authToken = localStorage.getItem('authToken');
  
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        return;
      }
      let requestBody: Record<string, any> = {};
  
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        requestBody = {
          Content: await readFileAsBase64(file),
        };
      } else if (urlInput.value) {
        requestBody = {
          URL: urlInput.value,
        };
      } else {
        console.error('Please select a file or provide a URL');
        return;
      }
  
      try {
        const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': authToken,
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Upload successful:', data);
        } else {
          console.error('Upload failed:', response.status);
        }
      } catch (error) {
        console.error('Error during upload:', error);
      }
    });
    // Upload and Ingestion End
  
    // Search Handling
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    const searchTypeSelect = document.getElementById('search-type') as HTMLSelectElement;
  
    searchButton.addEventListener('click', function () {
      const selectedSearchType = searchTypeSelect.value;
      const searchTerm = searchInput.value;
  
      if (selectedSearchType === 'id') {
        searchById(searchTerm);
      } else if (selectedSearchType === 'name') {
        searchByName(searchTerm);
      } else if (selectedSearchType === 'regex') {
        searchByRegex(searchTerm);
      } else {
        console.error('Invalid search type selected');
      }
    });
    // Search Handling End
  
    // Search by Regex
    async function searchByRegex(regex: string) {
      try {
        const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/byRegex', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            RegEx: regex,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Search by Regex successful:', data);
          displayResults(data);
        } else {
          console.error('Search failed:', response.status);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
    // Search by Regex End
  
    // Search by ID
    async function searchById(id: string) {
      try {
        const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Search by ID successful:', data);
          displayResults([data.metadata]);
        } else {
          console.error('Search failed:', response.status);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
    // Search by ID End
  
    // Search by Name
    async function searchByName(name: string) {
      try {
        const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/byName/${name}`, {
          method: 'GET',
        });
  
        if (response.ok) {
          console.log('Search By Name successful:', response.status);
        } else {
          console.error('Search failed:', response.status);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
    // Search by Name End
  
    // Search All
    const searchAllButton = document.getElementById('searchAllButton') as HTMLButtonElement;
  
    searchAllButton.addEventListener('click', async function () {
      try {
        const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Search all successful:', data);
          displayResults(data);
        } else {
          console.error('Search failed:', response.status);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    });
    // Search All End
  
    // Get Package Rating
    const rateInput = document.getElementById('rateInput') as HTMLInputElement;
    const rateButton = document.getElementById('rate-button') as HTMLButtonElement;
    const rateContainer = document.getElementById('rate-container') as HTMLElement;
  
    rateButton.addEventListener('click', async function () {
      const packageId = rateInput.value;
  
      try {
        const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${packageId}/rate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
  
          rateContainer.innerHTML = `
            <p>Metric 1: ${data.metric1}</p>
            <p>Metric 2: ${data.metric2}</p>
            <p>Metric 3: ${data.metric3}</p>
          `;
        } else {
          console.error('Error rating package:', response.status);
        }
      } catch (error) {
        console.error('Error during rating:', error);
      }
    });
    // Get Package Rating End
  
    // Update Package By ID
    const updateNameInput = document.getElementById('updateName') as HTMLInputElement;
    const updateVersionInput = document.getElementById('updateVersion') as HTMLInputElement;
    const updateIDInput = document.getElementById('updateID') as HTMLInputElement;
    const updateFileInput = document.getElementById('updateFileInput') as HTMLInputElement;
    const updateUrlInput = document.getElementById('updateUrlInput') as HTMLInputElement;
    const updateButton = document.getElementById('updateButton') as HTMLButtonElement;
  
    updateButton.addEventListener('click', async function () {
      const metadata = {
        ID: updateIDInput.value,
        Name: updateNameInput.value,
        Version: updateVersionInput.value,
      };
  
      const data = {
        Content: updateFileInput.value,
        URL: updateUrlInput.value,
      };
  
      if (updateFileInput.files && updateFileInput.files.length > 0) {
        const file = updateFileInput.files[0];
        data.Content = await readFileAsBase64(file);
      } else if (updateUrlInput.value) {
        data.URL = updateUrlInput.value;
      } else {
        console.error('Please select a file or provide a URL');
        return;
      }
  
      try {
        const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${metadata.ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metadata, data }),
        });
  
        if (response.ok) {
          console.log('Update successful:', response.status);
        } else {
          console.error('Update failed:', response.status);
        }
      } catch (error) {
        console.error('Error during update:', error);
      }
    });
    // Update Package By ID End
  
    // Display Results
    const resultContainer = document.getElementById('resultContainer') as HTMLElement;
  
    function displayResults(data: any[]) {
      resultContainer.innerHTML = ''; // Clear previous results
  
      if (data.length === 0) {
        resultContainer.innerHTML = 'No results found.';
      } else {
        data.forEach((result) => {
          const resultElement = document.createElement('div');
          resultElement.innerHTML = `Name: ${result.Name}, Version: ${result.Version}, ID: ${result.ID}`;
          resultContainer.appendChild(resultElement);
        });
      }
    }
    // Display Results End
  
    // Delete Handling
    const delInput = document.getElementById('delInput') as HTMLInputElement;
    const delButton = document.getElementById('del-button') as HTMLButtonElement;
    const delTypeSelect = document.getElementById('delsearch-type') as HTMLSelectElement;
  
    delButton.addEventListener('click', function () {
      const selectedDelType = delTypeSelect.value;
      const delTerm = delInput.value;
  
      if (selectedDelType === 'del-id') {
        delById(delTerm);
      } else if (selectedDelType === 'del-name') {
        delByName(delTerm);
      } else {
        console.error('Invalid delete type selected');
      }
    });
    // Delete Handling End
  
    // Delete Package By ID
    async function delById(id: string) {
      try {
        const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          console.log('Delete by ID successful:', response.status);
        } else {
          console.error('Delete failed:', response.status);
        }
      } catch (error) {
        console.error('Error during delete:', error);
      }
    }
    // Delete Package By ID End
  
    // Delete Package By Name
    async function delByName(name: string) {
      try {
        const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/byName/${name}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          console.log('Delete by Name successful:', response.status);
        } else {
          console.error('Delete failed:', response.status);
        }
      } catch (error) {
        console.error('Error during delete:', error);
      }
    }
    // Delete Package By Name End
  });
  
  // Function to read a file as a base64-encoded string
  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  function replacer(key: string, value: any) {
    if (typeof value === 'string') {
      return value.replace(/\\/g, ''); // Remove backslashes
    }
    return value;
  }
  