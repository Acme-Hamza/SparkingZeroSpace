// Handle custom dropdown interactions
document.querySelectorAll('.select-box').forEach(selectBox => {
    selectBox.addEventListener('click', function() {
        this.nextElementSibling.classList.toggle('show');
    });
});

document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        const selected = this.closest('.custom-select').querySelector('.selected');
        selected.textContent = this.textContent;

        let selectedOption = this.getAttribute('data-value');
        console.log('Selected Option:', selectedOption);

        // Add code to update team recommendations or sort options based on the selected value
        if (selectedOption === "Goku(super)") {
            console.log("Goku(Super) selected, updating team recommendations...");
        }

        this.parentElement.classList.remove('show');
    });
});

document.querySelectorAll('.custom-select').forEach(select => {
    const selectBox = select.querySelector('.select-box');
    const optionsList = select.querySelector('.select-options');

    selectBox.addEventListener('click', () => {
        select.classList.toggle('open'); // Toggle open class
        optionsList.style.display = optionsList.style.display === 'block' ? 'none' : 'block'; // Show/hide options
    });

    select.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            selectBox.querySelector('.selected').textContent = option.textContent; // Set selected option
            optionsList.style.display = 'none'; // Hide options after selection
            select.classList.remove('open'); // Close dropdown
        });
    });
});

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select').forEach(select => {
            select.classList.remove('open'); // Close all dropdowns
            select.querySelector('.select-options').style.display = 'none';
        });
    }
});

// Fetch character data
fetch('resources/characters.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load characters');
    }
    return response.json();
  })
  .then(characterData => {
    console.log('Character Data Fetched:', characterData);
  })
  .catch(error => console.error('Error loading characters:', error));

// Fetch guides
fetch('resources/guides.json')
  .then(response => response.json())
  .then(guideData => {
    // Process guides...
    console.log('Guides loaded:', guideData);
  })
  .catch(error => {
    console.error('Error fetching guide data:', error);
  });

  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        const selected = this.closest('.custom-select').querySelector('.selected');
        selected.textContent = this.textContent;

        let selectedOption = this.getAttribute('data-value');
        console.log('Selected Option:', selectedOption);

        if (selectedOption) {
            // Fetch character data
            fetch('resources/characters.json')
              .then(response => response.json())
              .then(charData => {
                // Log the characters to see what you're working with
                console.log('Available characters:', charData.characters);

                // Normalize the selected option (trim and lowercase)
                const character = charData.characters.find(char => char.name.toLowerCase().trim() === selectedOption.toLowerCase().trim());

                if (character) {
                  // Fetch guides data after finding the character
                  fetch('resources/guides.json')
                    .then(response => response.json())
                    .then(guideData => {
                      // Normalize the selected option to match guides key
                      const normalizedOption = selectedOption.trim();
                      const guides = guideData.guides[normalizedOption];

                      if (guides) {
                        document.getElementById('gen-guide').innerHTML = `
                          <h2>${normalizedOption} - Guide</h2>
                          <p>Mode 1: ${guides.mode1}</p>
                          <p>Mode 2: ${guides.mode2}</p>
                        `;
                      } else {
                        document.getElementById('gen-guide').innerHTML = "No guide available.";
                      }
                    });
                } else {
                  document.getElementById('gen-guide').innerHTML = "Character not found.";
                }
              })
              .catch(error => {
                console.error('Error fetching character or guide data:', error);
                document.getElementById('gen-guide').innerHTML = "An error occurred while fetching data.";
              });
        }
    });
});
