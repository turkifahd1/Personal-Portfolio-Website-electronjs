const API_URL = 'https://node-js-backend-personal-portfolio.onrender.com/api';

async function handleSubmit() {
  const projectName = document.getElementById('projectName').value;
  const description = document.getElementById('description').value;
  const projectLink = document.getElementById('projectLink').value;
  const images = document.getElementById('images').value;

  if (!projectName || !description || !projectLink || !images) {
    alert('Error', 'Please fill out all fields!');
    return;
  }

  document.getElementById('submitButton').classList.add('hidden');
  document.getElementById('loader').classList.remove('hidden');

  const formData = {
    projectName,
    description,
    projectLink,
    images
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.status === 200) {
      alert('Success', 'Data submitted successfully!');
      document.getElementById('projectName').value = '';
      document.getElementById('description').value = '';
      document.getElementById('projectLink').value = '';
      document.getElementById('images').value = '';
    } else {
      throw new Error('Failed to submit data');
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    alert('Error', 'An error occurred while submitting the data. Please try again!');
  } finally {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('submitButton').classList.remove('hidden');
  }
}