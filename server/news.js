async function fetchData() {
  try {
    const response = await fetch('https://node-js-backend-personal-portfolio.onrender.com/api');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    displayProjects(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

function displayProjects(projectsData) {
  const projectsContainer = document.getElementById('projects-container');
  projectsContainer.innerHTML = ''; // Clear previous projects
  projectsData.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.classList.add('p-6', 'border-b', 'border-gray-200');
    projectItem.id = `project-item-${project.id}`;
    projectItem.innerHTML = `
      <h2 class="text-xl font-semibold mb-2 text-gray-800">${project.projectName}</h2>
      <p class="text-gray-700">${project.description}</p>
      <p class="text-blue-500 mt-2">
        الرابط: <a href="${project.projectLink}" target="_blank" rel="noopener noreferrer">${project.projectLink}</a>
      </p>
      <img src="${project.images}" alt="${project.projectName}" class="w-full h-48 object-cover mt-2">
      <div class="flex justify-center mt-4">
        <button onclick="showEditModal('${project.id}', '${project.projectName}', '${project.description}', '${project.projectLink}', '${project.images}')" class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">تعديل</button>
        <button onclick="handleDelete('${project.id}')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">حذف</button>
      </div>
    `;
    projectsContainer.appendChild(projectItem);
  });
}

function showEditModal(id, projectName, description, projectLink, images) {
  const modal = document.getElementById('edit-modal');
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = `
    <input type="hidden" id="project-id" value="${id}">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="project-name">اسم المشروع</label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="project-name" type="text" value="${projectName}">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="project-description">وصف المشروع</label>
      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="project-description">${description}</textarea>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="project-link">رابط المشروع</label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="project-link" type="text" value="${projectLink}">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="project-images">صور المشروع</label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="project-images" type="text" value="${images}">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="project-image-file">اختر صورة المشروع</label>
      <input onchange="handleImageUpload(event)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="project-image-file" type="file">
      <img id="project-preview-image" class="w-full h-48 object-cover mt-2 hidden">
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.add('hidden');
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const imagePreview = document.getElementById('project-preview-image');
    imagePreview.src = e.target.result;
    imagePreview.classList.remove('hidden');
  };

  reader.readAsDataURL(file);
}
async function handleSave() {
  const id = document.getElementById('project-id').value;
  const projectName = document.getElementById('project-name').value;
  const description = document.getElementById('project-description').value;
  const projectLink = document.getElementById('project-link').value;
  const images = document.getElementById('project-images').value;

  try {
    const response = await fetch(`https://node-js-backend-personal-portfolio.onrender.com/api/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectName, description, projectLink, images })
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    const projectItem = document.getElementById(`project-item-${id}`);
    projectItem.querySelector('h2').innerText = projectName;
    projectItem.querySelector('p:nth-of-type(1)').innerText = description;
    projectItem.querySelector('p:nth-of-type(2)').innerHTML = `الرابط: <a href="${projectLink}" target="_blank" rel="noopener noreferrer">${projectLink}</a>`;
    projectItem.querySelector('p:nth-of-type(3)').innerHTML = `${images} <span class="font-semibold text-gray-800">:الصور</span>`;

    // Hide the entire body of the page
    document.body.style.display = 'none';

    // Clear image preview if no new image selected
    const imageFile = document.getElementById('project-image-file');
    if (!imageFile.files.length) {
      const imagePreview = document.getElementById('project-preview-image');
      imagePreview.src = '';
      imagePreview.classList.add('hidden');
    }

  } catch (error) {
    console.error('Error updating project:', error);
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const imagePreview = document.getElementById('project-preview-image');
    imagePreview.src = e.target.result;
    imagePreview.classList.remove('hidden');
  };

  reader.readAsDataURL(file);
}





async function handleDelete(id) {
  try {
    const response = await fetch(`https://node-js-backend-personal-portfolio.onrender.com/api/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

    const projectItem = document.getElementById(`project-item-${id}`);
    if (projectItem) {
      projectItem.remove();
    }

    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}

fetchData();
