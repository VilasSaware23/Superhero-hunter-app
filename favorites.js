    // event listener to execute code when the DOM content is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // get the container element where favorite character cards will be rendered
        const favoritesContainer = document.getElementById('favorites-container');

        // function to render favorite characters from localStorage
        const renderFavorites = () => {
            favoritesContainer.innerHTML = ''; // Clear existing content
            let hasFavorites = false;

            // loop through localStorage to retrieve and render favorite characters
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('liked-') && localStorage.getItem(key) === 'true') {
                    const characterId = key.replace('liked-', '');
                    const characterData = JSON.parse(localStorage.getItem(`character-${characterId}`));
                    if (characterData) {
                        renderCharacterCard(characterData);
                        hasFavorites = true;
                    }
                }
            }

            // If no favorite characters found, render an empty message
            if (!hasFavorites) {
                renderEmptyMessage();
            }
        };

        // function to render a single character card
        const renderCharacterCard = (character) => {
            // create a div element for the character card
            const cardDiv = document.createElement('div');
            cardDiv.className = 'character-card';

            // populate the card with character data
            cardDiv.innerHTML = `
                <img src="${character.thumbnail}" alt="${character.name}">
                <h3>${character.name}</h3>
                <button class="remove-button">Remove from Favorites</button>
            `;

            // add event listener to the remove button to remove character from favorites
            const removeButton = cardDiv.querySelector('.remove-button');
            removeButton.addEventListener('click', () => {
                localStorage.setItem(`liked-${character.id}`, 'false'); // Update localStorage
                renderFavorites(); // Re-render favorites after removal
            });

            // append the character card to the favorites container
            favoritesContainer.appendChild(cardDiv);
        };

        // function to render an empty message when no favorite characters are found
        const renderEmptyMessage = () => {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No favorite characters added yet.';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.margin = '300px';
            emptyMessage.style.color = 'white';
            emptyMessage.style.fontSize = '30px';
            favoritesContainer.appendChild(emptyMessage);
        };

        renderFavorites(); // Initial rendering of favorite characters on page load
    });
