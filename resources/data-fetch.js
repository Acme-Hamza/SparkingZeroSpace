document.addEventListener('DOMContentLoaded', () => {
    const selectBoxes = document.querySelectorAll('.custom-select');

    // Fetch character data once when the DOM is loaded
    fetch('resources/characters.json')
        .then(response => response.json())
        .then(data => {
            const characters = data.characters;
            const selectBox = document.querySelector('.select-box');
            const optionsList = document.querySelector('.select-options');

            // Populate the dropdown with character names
            characters.forEach(character => {
                const option = document.createElement('li');
                option.classList.add('option');
                option.textContent = character.name;
                option.dataset.character = JSON.stringify(character); // Store character data in dataset
                optionsList.appendChild(option);
            });

            // Add event listener for the entire select box
            selectBox.addEventListener('click', (e) => {
                optionsList.classList.toggle('active'); // Toggle visibility of options
                e.stopPropagation(); // Stop event from bubbling to document
            });

            // Add event listener for dropdown options
            optionsList.addEventListener('click', (e) => {
                if (e.target.classList.contains('option')) {
                    const characterData = JSON.parse(e.target.dataset.character);
                    displayCharacterDetails(characterData);
                    optionsList.classList.remove('active'); // Close options after selection
                }
            });
        });

    // Function to display character details
    function displayCharacterDetails(character) {
        const contentArea = document.querySelector('.content-area');
        contentArea.innerHTML = `
            <h2>${character.name}</h2>
            <p>${character.tier}</p>
            <p>DP: ${character.DP}</p>
            <h3>Move Set:</h3>
            <ul>
                <li>${character.moveSet.skill1.name} (Skill Points: ${character.moveSet.skill1.skillPoints})</li>
                <li>${character.moveSet.skill2.name} (Skill Points: ${character.moveSet.skill2.skillPoints})</li>
                <li>${character.moveSet.blast1.name} (Ki Cost: ${character.moveSet.blast1.kiCost})</li>
                <li>${character.moveSet.blast2.name} (Ki Cost: ${character.moveSet.blast2.kiCost})</li>
            </ul>
            <h3>Ultimate Skill:</h3>
            <p>${character.ultimateSkill.name} (Ki Cost: ${character.ultimateSkill.kiCost})</p>
            <h3>Fusion Partner:</h3>
            <p>${character.fusionPartner ? character.fusionPartner.join(', ') : 'None'}</p>
            <h3>Transformations:</h3>
            <ul>
                ${character.transformations.map(transformation => `<li>${transformation}</li>`).join('')}
            </ul>
        `;
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select')) {
            selectBoxes.forEach(selectBox => {
                const optionsList = selectBox.querySelector('.select-options');
                optionsList.classList.remove('active'); // Close the options list
            });
        }
    });
});
