    // Displaying more deatis by using api public key and private key
    const PUBLIC_KEY = 'e5701205a41828cea004580d227e57bd'; 
    const PRIVATE_KEY = '798856f4f1f234e20596f036fabb56301ef2e80a';


    const getCharacterIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    // fetching the characters from the api link properties
    const fetchCharacterDetails = async (characterId) => {
        const TS = new Date().getTime();
        const HASH = CryptoJS.MD5(TS + PRIVATE_KEY + PUBLIC_KEY).toString();

        try {
            const response = await axios.get(`https://gateway.marvel.com/v1/public/characters/${characterId}`, {
                params: {
                    ts: TS,
                    apikey: PUBLIC_KEY,
                    hash: HASH
                }
            });

            const character = response.data.data.results[0];
            displayCharacterDetails(character);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //displaying  the requested proprties of  characters in details
    const displayCharacterDetails = (character) => {
        const container = document.getElementById('character-details');
        container.innerHTML = '';

        const characterDiv = document.createElement('div');
        characterDiv.className = 'character-details';

        // const isLiked = localStorage.getItem(`liked-${character.id}`) === 'true';

        characterDiv.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
            <p>${character.description || 'No description available.'}</p>
            <p>Comics: ${character.comics.available}</p>
            <p>Series: ${character.series.available}</p>
            <p>Stories: ${character.stories.available}</p>
            
   
        `;

        container.appendChild(characterDiv);
    };

    // Event listener to fetch characters of a perticular id  when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const characterId = getCharacterIdFromUrl();
        fetchCharacterDetails(characterId);
    });
