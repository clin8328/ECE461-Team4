document.addEventListener('DOMContentLoaded', function () {
  // Authentication
  const loginButton = document.getElementById('login-button') as HTMLButtonElement;

  if (loginButton) {
      loginButton.addEventListener('click', async function () {
          const username = prompt('Enter username:');
          const password = prompt('Enter password:');
          const admin = prompt('Enter admin status (true/false):');

          try {
              const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/authenticate', {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      User: {
                          name: username,
                          isAdmin: admin,
                      },
                      Secret: {
                          password: password,
                      },
                  }, replacer),
              });

              if (response.ok) {
                  const authToken = await response.json();
                  console.log('Login successful. Token:', authToken);
                  alert('Login successful');
                  localStorage.setItem('authToken', authToken);
              } else {
                  console.error('Login failed:', response.status);
                  alert('Login failed');
              }
          } catch (error) {
              console.error('Error during login:', error);
              alert('Error during login');
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
          alert('Authentication token is missing. Please authenticate first.');
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
              alert('Registry reset successful');
          } else {
              console.error('Registry reset failed:', response.status);
              alert('Registry reset failed');
          }
      } catch (error) {
          console.error('Error resetting registry:', error);
          alert('Error resetting registry');
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
          alert('Authentication token is missing. Please authenticate first.');
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
          alert('Please select a file or provide a URL');
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
              alert('Upload successful');
              urlInput.value = '';
              fileInput.value = '';
          } else {
              console.error('Upload failed:', response.status);
              alert('Upload failed');
          }
      } catch (error) {
          console.error('Error during upload:', error);
          alert('Error during upload');
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
          alert('Invalid search type selected');
      }
  });
  // Search Handling End

  // Search by Regex
  async function searchByRegex(regex: string) {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      try {
          const response = await fetch('http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/byRegex', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': authToken,
              },
              body: JSON.stringify({
                  RegEx: regex,
              }),
          });

          if (response.ok) {
              const data = await response.json();
              console.log('Search by Regex successful:', data);
              searchInput.value = '';
              displayResults(data);
          } else {
              console.error('Search failed:', response.status);
              alert('Search failed');
          }
      } catch (error) {
          console.error('Error during search:', error);
          alert('Error during search');
      }
  }
  // Search by Regex End

  // Search by ID
  async function searchById(id: string) {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      try {
          const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${id}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': authToken,
              },
          });

          if (response.ok) {
              const data = await response.json();
              console.log('Search by ID successful:', data);
              searchInput.value = '';
              displayResults([data]);
          } else {
              console.error('Search failed:', response.status);
              alert('Search failed');
          }
      } catch (error) {
          console.error('Error during search:', error);
          alert('Error during search');
      }
  }
  // Search by ID End

  // Search by Name
  async function searchByName(name: string) {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      try {
          const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/byName/${name}`, {
              method: 'GET',
              headers: {
                'X-Authorization': authToken,
              },
          });

          if (response.ok) {
              const data = await response.json();
              console.log('Search By Name successful:', data);
              searchInput.value = '';
              displayResults(data);
          } else {
              console.error('Search failed:', response.status);
              alert('Search failed');
          }
      } catch (error) {
          console.error('Error during search:', error);
          alert('Error during search');
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
              alert('Search failed');
          }
      } catch (error) {
          console.error('Error during search:', error);
          alert('Error during search');
      }
  });
  // Search All End

  // Get Package Rating
  const rateInput = document.getElementById('rateInput') as HTMLInputElement;
  const rateButton = document.getElementById('rate-button') as HTMLButtonElement;
  const rateContainer = document.getElementById('rate-container') as HTMLElement;

  rateButton.addEventListener('click', async function () {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      const packageId = rateInput.value;

      try {
          const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${packageId}/rate`, {
              method: 'GET',
              headers: {
                'X-Authorization': authToken,
              },
          });

          if (response.ok) {
              const data = await response.json();

              rateContainer.innerHTML = `
                  <p>Bus Factor: ${data.BusFactor}</p>
                  <p>Correctness: ${data.Correctness}</p>
                  <p>Ramp Up: ${data.RampUp}</p>
                  <p>Responsive Maintainer: ${data.ResponsiveMaintainer}</p>
                  <p>License Score: ${data.LicenseScore}</p>
                  <p>Good Pinning Practice: ${data.GoodPinningPractice}</p>
                  <p>Pull Request: ${data.PullRequest}</p>
                  <p>Net Score: ${data.NetScore}</p>
              `;
              rateInput.value = '';
          } else {
              console.error('Error rating package:', response.status);
              alert('Error rating package');
          }
      } catch (error) {
          console.error('Error during rating:', error);
          alert('Error during rating');
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
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      const metadata = {
          ID: updateIDInput.value,
          Name: updateNameInput.value,
          Version: updateVersionInput.value,
      };

      const data: { Content: string | null, URL: string | null } = {
        Content: null,
        URL: null,
      };

      if (updateFileInput.files && updateFileInput.files.length > 0) {
          const file = updateFileInput.files[0];
          data.Content = await readFileAsBase64(file);
      } else if (updateUrlInput.value) {
          data.URL = updateUrlInput.value;
      } else {
          console.error('Please select a file or provide a URL');
          alert('Please select a file or provide a URL');
          return;
      }

      try {
          const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${metadata.ID}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': authToken,
              },
              body: JSON.stringify({ metadata, data }),
          });

          if (response.ok) {
              console.log('Update successful:', response.status);
              updateUrlInput.value = '';
              updateFileInput.value = '';
              alert('Update successful');
          } else {
              console.error('Update failed:', response.status);
              alert('Update failed');
          }
      } catch (error) {
          console.error('Error during update:', error);
          alert('Error during update');
      }
  });
  // Update Package By ID End

  // Display Results
  const resultContainer = document.getElementById('resultContainer') as HTMLElement;

  function displayResults(data: any[]) {
      resultContainer.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
          resultContainer.innerHTML = 'No results found.';
      } else {
          data.forEach((result) => {
              const resultElement = document.createElement('div');
              resultElement.classList.add('result-item');

              if (result && result.Version && result.Name) {
                  resultElement.innerHTML = `
                      Name: ${result.Name || 'N/A'},
                      Version: ${result.Version || 'N/A'}
                  `;
              } else if (result && result.metadata) {
                  const { metadata } = result;
                  resultElement.innerHTML = `
                      Name: ${metadata.Name || 'N/A'},
                      Version: ${metadata.Version || 'N/A'},
                      ID: ${metadata.ID || 'N/A'}
                  `;
              } else if (result && result.User && result.Date && result.Packagemetadata && result.Action) {
                  const { User, Date, Packagemetadata, Action } = result;
                  resultElement.innerHTML = `
                      User: ${User.name || 'N/A'}, Admin: ${User.isAdmin || 'N/A'},
                      Date: ${Date || 'N/A'},
                      Package Name: ${Packagemetadata.Name || 'N/A'},
                      Version: ${Packagemetadata.Version || 'N/A'},
                      ID: ${Packagemetadata.ID || 'N/A'},
                      Action: ${Action || 'N/A'}
                  `;
              }

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
          alert('Invalid delete type selected');
      }
  });
  // Delete Handling End

  // Delete Package By ID
  async function delById(id: string) {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      try {
          const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/${id}`, {
              method: 'DELETE',
              headers: {
                'X-Authorization': authToken,
              },
          });

          if (response.ok) {
              console.log('Delete by ID successful:', response.status);
              delInput.value = '';
              alert('Delete by ID successful');
          } else {
              console.error('Delete failed:', response.status);
              alert('Delete failed');
          }
      } catch (error) {
          console.error('Error during delete:', error);
          alert('Error during delete');
      }
  }
  // Delete Package By ID End

  // Delete Package By Name
  async function delByName(name: string) {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication token is missing. Please authenticate first.');
        alert('Authentication token is missing. Please authenticate first.');
        return;
      }
      try {
          const response = await fetch(`http://ec2-3-137-163-91.us-east-2.compute.amazonaws.com/package/byName/${name}`, {
              method: 'DELETE',
              headers: {
                'X-Authorization': authToken,
              },
          });

          if (response.ok) {
              console.log('Delete by Name successful:', response.status
              );
              delInput.value = '';
              alert('Delete by Name successful');
          } else {
              console.error('Delete failed:', response.status);
              alert('Delete failed');
          }
      } catch (error) {
          console.error('Error during delete:', error);
          alert('Error during delete');
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

function replacer(key: string, value: any): any {
  if (typeof value === 'string') {
      return value.replace(/\\/g, ''); // Remove backslashes
  }
  return value;
}

