document.addEventListener('DOMContentLoaded', () => {
    const selectBoxes = document.querySelectorAll('.custom-select');

    selectBoxes.forEach(selectBox => {
        const selected = selectBox.querySelector('.selected');
        const optionsList = selectBox.querySelector('.select-options');

        // Attach click event to the entire select box
        selectBox.addEventListener('click', () => {
            closeAllDropdowns();
            optionsList.classList.toggle('active');
        });

        const options = selectBox.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click event from bubbling up to selectBox
                handleOptionSelect(option, selected, optionsList);
            });
        });
    });

    // Handle option selection
    function handleOptionSelect(option, selected, optionsList) {
        selected.textContent = option.textContent;
        selected.setAttribute('data-value', option.getAttribute('data-value'));
        optionsList.classList.remove('active');

        // Fetch and display character data
        fetchCharacterData(option.getAttribute('data-value'));
    }

    // Fetch character data function
    function fetchCharacterData(selectedOption) {
        fetch('resources/characters.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(charData => {
                const character = charData.characters.find(
                    char => char.name.toLowerCase().trim() === selectedOption.toLowerCase().trim()
                );
    
                if (character) {
                    displayCharacterData(character);
                } else {
                    displayError("Character not found.");
                }
            })
            .catch(error => {
                console.error('Error fetching character data:', error);
                displayError("An error occurred while fetching data.");
            });
    }
    

    // Function to display character data
    function displayCharacterData(character) {
        document.getElementById('gen-guide').innerHTML = `
            <h2>${character.name}</h2>
            <p>${character.tier}</p>
            <p>DP Cost: ${character.DP}</p>
            <h3>Move Set:</h3>
            <p>Skill 1: ${character.moveSet.skill1.name} (Skill Points: ${character.moveSet.skill1.skillPoints})</p>
            <p>Skill 2: ${character.moveSet.skill2.name} (Skill Points: ${character.moveSet.skill2.skillPoints})</p>
            <p>Blast 1: ${character.moveSet.blast1.name} (Ki Cost: ${character.moveSet.blast1.kiCost})</p>
            <p>Blast 2: ${character.moveSet.blast2.name} (Ki Cost: ${character.moveSet.blast2.kiCost})</p>
            <p>Ultimate Skill: ${character.ultimateSkill.name} (Ki Cost: ${character.ultimateSkill.kiCost})</p>
        `;
        
        displayFusionPartners(character.fusionPartner);
        displayTransformations(character.transformations);
    }

    // Function to display fusion partners
   // Function to display fusion partners
// Function to display fusion partners with clickable links
function displayFusionPartners(fusionPartners) {
    const fusionElement = document.getElementById('fusion');
    if (fusionPartners && fusionPartners.length > 0) {
        fusionElement.innerHTML = `<h3>Fusion Partner:</h3><ul>${
            fusionPartners.map(partner => `<li><a href="#" onclick="fetchCharacterData('${partner}')">${partner}</a></li>`).join("")
        }</ul>`;
    } else {
        fusionElement.innerHTML = "<p>No fusion partner available.</p>";
    }
}

// Function to display transformations with clickable links
function displayTransformations(transformations) {
    const transformationsElement = document.getElementById('transformations');
    if (transformations && transformations.length > 0) {
        transformationsElement.innerHTML = `<h3>Transformations:</h3><ul>${
            transformations.map(transformation => `<li><a href="#" onclick="fetchCharacterData('${transformation}')">${transformation}</a></li>`).join("")
        }</ul>`;
    } else {
        transformationsElement.innerHTML = "<p>No transformations available.</p>";
    }
}



    // Function to display error messages
    function displayError(message) {
        document.getElementById('gen-guide').innerHTML = `<p class="yellow-text">${message}</p>`;
    }

    // Close all dropdowns when clicking outside
    function closeAllDropdowns() {
        selectBoxes.forEach(selectBox => {
            const optionsList = selectBox.querySelector('.select-options');
            optionsList.classList.remove('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select')) {
            closeAllDropdowns();
        }
    });
});
