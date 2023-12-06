document.addEventListener('DOMContentLoaded', async () => {
    // File Input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    const selectedFileName = document.getElementById('selectedFileName') as HTMLSpanElement | null;
    const fileContainer = document.querySelector('.home-file-label') as HTMLElement | null;

    let fileInputClicked = false;

    if (fileInput && selectedFileName && fileContainer) {
      fileContainer.addEventListener('mousedown', () => {
        if (!fileInputClicked) {
          fileInput.click();
          fileInputClicked = true;

          // Reset the file input clicked flag after a short delay (50 milliseconds in this example)
          setTimeout(() => {
            fileInputClicked = false;
          }, 50);
        }
      });

      fileInput.addEventListener('change', (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files[0]) {
          selectedFileName.textContent = `Selected file: ${files[0].name}`;
        }
      });
    } else {
      console.error('One or more DOM elements not found.');
    }

    // Search Type Select
    const searchTypeSelect = document.getElementById('search-type') as HTMLSelectElement | null;
    const searchInput = document.querySelector('.home-textinput1.input') as HTMLInputElement | null;

    if (searchTypeSelect && searchInput) {
      // Add event listener to the select element
      searchTypeSelect.addEventListener('change', function () {
        // Update the placeholder based on the selected option
        switch (searchTypeSelect.value) {
          case 'id':
            searchInput.placeholder = 'Search by ID';
            break;
          case 'name':
            searchInput.placeholder = 'Search by Name';
            break;
          case 'regex':
            searchInput.placeholder = 'Search by Regex';
            break;
          default:
            searchInput.placeholder = 'Search for package';
        }
      });
    } else {
      console.error('One or more DOM elements not found.');
    }

    // Authenticate
    let isAuthenticated = false;
  
    const loginButton = document.querySelector('.home-login');
    const featuresContainer = document.querySelector('.home-upload-container');
    const searchContainer = document.querySelector('.home-search-container');
  
    if (loginButton) {
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
                User: { name: username, isAdmin: false },
                Secret: { password: password },
              }),
            });
  
            if (response.ok) {
              const token = await response.json();
              console.log('Authentication successful. Token:', token);
              localStorage.setItem('authToken', token);
              isAuthenticated = true;
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
    }
  
    // Upload button
    const uploadButton = document.getElementById('uploadButton');
    if (uploadButton) {
      uploadButton.addEventListener('click', async () => {
        console.log('Handling package upload...');
        
        const zipFileInput = document.getElementById('fileInput') as HTMLInputElement;
        const urlInput = document.getElementById('urlInput') as HTMLInputElement;
      
        const authToken = localStorage.getItem('authToken');
      
        if (!authToken) {
          // Handle case where authentication token is not available
          console.error('Authentication token is missing. Please authenticate first.');
          return;
        }
      
        // Check if either a file or URL is provided
        if ((zipFileInput.files?.length ?? 0) > 0 || urlInput.value.trim() !== '') {
          console.log('File or URL provided.');
      
          const formData = new FormData();
      
          // Append file or URL to FormData
          if (zipFileInput.files && zipFileInput.files.length > 0) {
            formData.append('Content', zipFileInput.files[0]);
          } else {
            formData.append('URL', urlInput.value.trim());
          }
      
          // Additional data you want to send, for example JSProgram
          //formData.append('JSProgram', 'YourJSProgramContent');
      
          try {
            console.log('Sending POST request...');
            
            // Make a POST request to your server endpoint for package upload
            const response = await fetch('http://localhost:2000/package', {
              method: 'POST',
              headers: {
                'x-Authorization': authToken,
              },
              body: formData,
            });
      
            console.log('Received response:', response);
            
            if (response.ok) {
              // Handle successful upload
              const result = await response.json();
              console.log('Upload successful:', result);
            } else {
              // Handle upload error
              console.error('Upload failed:', response.status);
            }
          } catch (error) {
            // Handle fetch error
            console.error('Fetch error:', error);
          }
        } else {
          // Handle case where neither file nor URL is provided
          console.error('Please provide either a file or a URL for package upload.');
        }
      });
    }
  });



