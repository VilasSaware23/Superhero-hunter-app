    // Accessing public and private key
    const PUBLIC_KEY = 'e5701205a41828cea004580d227e57bd'; // Replace with your actual public key
    const PRIVATE_KEY = '798856f4f1f234e20596f036fabb56301ef2e80a'; // Replace with your actual private key

    // fetching the characters from the api link properties
    const fetchCharacters = async () => {
        const TS = new Date().getTime();
        const HASH = CryptoJS.MD5(TS + PRIVATE_KEY + PUBLIC_KEY).toString();
        try {
            const response = await axios.get(`https://gateway.marvel.com/v1/public/characters`, {
                params: {
                    ts: TS,
                    apikey: PUBLIC_KEY,
                    hash: HASH
                }
            });
            const characters = response.data.data.results;
            displayCharacters(characters);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // performing search operation anddisplaying search result in home page by clicking search button
    const searchCharacters = async (event) => {
    event.preventDefault(); 
    const searchInput = document.getElementById('search-input').value.trim();
    if (searchInput === '') {
        alert('Please enter a character name.');
        return;
    }
    const TS = new Date().getTime();
    const HASH = CryptoJS.MD5(TS + PRIVATE_KEY + PUBLIC_KEY).toString();
    try {
        const response = await axios.get('https://gateway.marvel.com/v1/public/characters', {
            params: {
                ts: TS,
                apikey: PUBLIC_KEY,
                hash: HASH,
                nameStartsWith: searchInput
            }
        });

        const characters = response.data.data.results;
        if (characters.length === 0) {
            // Display message in popup (alert)
            alert('Entered character name is not available');
        } else {
            displayCharacters(characters);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


    //displaying all the characters in the home page from the api
    const displayCharacters = (characters) => {
        const container = document.getElementById('characters');
        container.innerHTML = '';

        characters.forEach(character => {
            const characterDiv = document.createElement('div');
            characterDiv.className = 'character';

            const isLiked = localStorage.getItem(`liked-${character.id}`) === 'true';


            characterDiv.innerHTML = `
                <h3>${character.name}</h3>
                <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
                <button onclick="viewDetails(${character.id})" class="search-button">View More</button>
                <button class="like-button">${isLiked ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            `;

            container.appendChild(characterDiv);
        //adding and removing favorites characters 
        const likeButton = characterDiv.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            const isLiked = localStorage.getItem(`liked-${character.id}`) === 'true';
            localStorage.setItem(`liked-${character.id}`, !isLiked);
            likeButton.textContent = !isLiked ? 'Remove from Favorites' : 'Add to Favorites';

            if (!isLiked) {
                const characterData = {
                    id: character.id,
                    name: character.name,
                    thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
                    description: character.description || 'No description available.',
                    comics: character.comics.available,
                    series: character.series.available,
                    stories: character.stories.available
                };
                localStorage.setItem(`character-${character.id}`, JSON.stringify(characterData));
            } else {
                localStorage.removeItem(`character-${character.id}`);
            }
        });
        });
    };


    // Function to redirect to a character details page based on the provided characterId
    const viewDetails = (characterId) => {
        window.location.href = `character.html?id=${characterId}`;
    };

    // Event listener to fetch characters when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', fetchCharacters);