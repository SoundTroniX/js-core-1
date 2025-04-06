const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestionsList");
const reposList = document.getElementById("reposList");


function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}


async function fetchRepositories(query) {
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
    const data = await response.json();
    return data.items.slice(0, 5); 
  } catch (error) {
    console.log(error);
  }
}


searchInput.addEventListener("input", debounce(async function (event) {
    const query = event.target.value.trim();
//
    if (query.length === 0) {
      suggestionsList.innerHTML = ""; 
      return;
    }
//
    const repos = await fetchRepositories(query);
//
    
    suggestionsList.innerHTML = "";

//
    repos.forEach((repo) => {
      const suggestion = document.createElement("li");
      suggestion.textContent = `${repo.full_name} (${repo.stargazers_count} ⭐️)`;
      suggestion.onclick = () => addRepoToList(repo);
      suggestionsList.appendChild(suggestion);
    });
  }, 500)
); 


function addRepoToList(repo) {
  const existingRepo = document.querySelector(`#repo-${repo.id}`);
  if (existingRepo) return; 
//
  const repoItem = document.createElement("div");
  repoItem.classList.add("repo-item");
  repoItem.setAttribute("id", `repo-${repo.id}`);
//
  const nameEl = document.createElement("span");
  nameEl.textContent = repo.full_name;
  repoItem.appendChild(nameEl);
//
  const ownerEl = document.createElement("span");
  ownerEl.textContent = `@${repo.owner.login}`;
  repoItem.appendChild(ownerEl);
//
  const starsEl = document.createElement("span");
  starsEl.textContent = `${repo.stargazers_count} ⭐️`;
  repoItem.appendChild(starsEl);
//
  const closeButton = document.createElement("button");
  closeButton.textContent = "Удалить";
  closeButton.onclick = () => removeRepoFromList(`repo-${repo.id}`);
  repoItem.appendChild(closeButton);
//
  reposList.appendChild(repoItem);
//
  searchInput.value = "";
  suggestionsList.innerHTML = "";
}


function removeRepoFromList(id) {
  const repoItem = document.getElementById(id);
  if (repoItem) {
    repoItem.remove();
  }
}
