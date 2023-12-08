document.addEventListener('DOMContentLoaded', function () {
    // Authentication
    const loginButton = document.getElementById('login-button') as HTMLButtonElement;

    loginButton.addEventListener('click', async () => {
        const username = prompt('Enter your username:');
        const password = prompt('Enter your password:');

        if (username && password) {
            try {
                const response = await fetch('http://localhost:2000/authenticate', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        User: { name: username, isAdmin: true },
                        Secret: { password: password },
                    }),
                });

                if (response.ok) {
                    const token = await response.json();
                    console.log('Authentication successful. Token:', token);
                    localStorage.setItem('authToken', token);
                } else {
                    console.error('Authentication failed. Status:', response.status);
                }
            } catch (error) {
                console.error('Error during authentication:', error);
            }
        } else {
            console.log('Authentication canceled.');
        }
    });
    // Authentication End

    // Reset Registry
    const resetButton = document.getElementById('resetButton') as HTMLButtonElement;

    resetButton.addEventListener('click', async function () {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            // Handle case where authentication token is not available
            console.error('Authentication token is missing. Please authenticate first.');
            return;
        }

        try {
            const response = await fetch('http://localhost:2000/reset', {
                method: 'DELETE',
            });

            if (response.ok) {
                // Handle the successful response
                console.log('Registry reset successful');
            } else {
                // Handle the error response
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
            // Handle case where authentication token is not available
            console.error('Authentication token is missing. Please authenticate first.');
            return;
        }
        let requestBody: Record<string, any> = {};

        if (fileInput.files && fileInput.files.length > 0) {
            // If a file is selected, include it in the request body
            const file = fileInput.files[0];
            requestBody = {
                Content: await readFileAsBase64(file),
            };
        } else if (urlInput.value) {
            // If a URL is provided, include it in the request body
            requestBody = {
                URL: urlInput.value,
            };
        } else {
            // Handle the case where neither file nor URL is provided
            console.error('Please select a file or provide a URL');
            return;
        }

        try {
            const response = await fetch('http://localhost:2000/package', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // Handle the successful response
                const data = await response.json();
                console.log('Upload successful:', data);
            } else {
                // Handle the error response
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

        // Call the appropriate search endpoint based on the selected option
        if (selectedSearchType === 'id') {
            // Call the search by ID endpoint
            searchById(searchTerm);
        } else if (selectedSearchType === 'name') {
            // Call the search by name endpoint
            searchByName(searchTerm);
        } else if (selectedSearchType === 'regex') {
            // Call the search by regex endpoint
            searchByRegex(searchTerm);
        } else {
            console.error('Invalid search type selected');
        }
    });
    // Search Handling End

    // Search by Regex
    async function searchByRegex(regex: string) {
        try {
            const response = await fetch('http://localhost:2000/package/byRegex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RegEx: regex,
                }),
            });

            if (response.ok) {
                // Handle the successful response
                const data = await response.json();
                console.log('Search by Regex successful:', data);
                displayResults(data);
            } else {
                // Handle the error response
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
            const response = await fetch(`http://localhost:2000/package/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Handle the successful response
                const data = await response.json();
                console.log('Search by ID successful:', data);
                displayResults([data.metadata]);
            } else {
                // Handle the error response
                console.error('Search failed:', response.status);
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    }
    // Search by ID End

    // Search by Name
    function searchByName(name: string) {
        console.log('Searching by Name:', name);
    }
    // Search by Name End

    // Search All
    const searchAllButton = document.getElementById('searchAllButton') as HTMLButtonElement;

    searchAllButton.addEventListener('click', function () {
        searchAllPackages();
    });

    function searchAllPackages() {
        console.log('Searching all packages');
    }
    // Search All End

    // Get Package Rating
    const rateInput = document.getElementById('rateInput') as HTMLInputElement;
    const rateButton = document.getElementById('rate-button') as HTMLButtonElement;
    const rateContainer = document.getElementById('rate-container') as HTMLElement; // Assuming you have a container to display the results

    rateButton.addEventListener('click', async function () {
        const packageId = rateInput.value;

        try {
            const response = await fetch(`http://localhost:2000/package/${packageId}/rate`, {
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
                // Handle error and display a message to the user
            }
        } catch (error) {
            console.error('Error during rating:', error);
            // Handle error and display a message to the user
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

        const data: { Content: string | null; URL: string | null; JSProgram: any } = {
            Content: null,
            URL: null,
            JSProgram: null,  // You may need to fetch this value from the UI
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
            const response = await fetch(`http://localhost:2000/package/${metadata.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any other necessary headers, such as authorization token
                },
                body: JSON.stringify({ metadata, data }),
            });

            if (response.ok) {
                // Handle the successful response
                const data = await response.json();
                console.log('Update successful:', data);
            } else {
                // Handle the error response
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

});

// Function to read a file as a base64-encoded string
function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
