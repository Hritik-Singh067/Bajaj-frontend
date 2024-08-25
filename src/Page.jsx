import React, { useState } from 'react';

function ApiDataComponent() {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleOptionClick = (option) => {
        setSelectedOptions(prevSelected =>
            prevSelected.includes(option)
                ? prevSelected.filter(item => item !== option)
                : [...prevSelected, option]
        );
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const parsedData = JSON.parse(inputData);

            if (!parsedData.data || !Array.isArray(parsedData.data)) {
                throw new Error('Invalid JSON format: "data" should be an array.');
            }

            const response = await fetch('https://bajaj-88ev.onrender.com/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parsedData)
            });

            const result = await response.json();

            if (response.ok) {
                setResponseData(result);
            } else {
                setError(result.message || 'Something went wrong!');
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const renderResponseData = () => {
        if (!responseData || selectedOptions.length === 0) return null;

        const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
        return selectedOptions.map(option => {
            let displayData;
            switch (option) {
                case 'numbers':
                    displayData = numbers.length > 0 ? numbers.join(', ') : 'No numbers found';
                    break;
                case 'alphabets':
                    displayData = alphabets.length > 0 ? alphabets.join(', ') : 'No alphabets found';
                    break;
                case 'highest_lowercase_alphabet':
                    displayData = highest_lowercase_alphabet.length > 0 ? highest_lowercase_alphabet.join(', ') : 'No lowercase alphabet found';
                    break;
                default:
                    displayData = 'Invalid option selected';
            }
            return (
                <div key={option}>
                    <h3>{option.charAt(0).toUpperCase() + option.slice(1)}:</h3>
                    <p>{displayData}</p>
                </div>
            );
        });
    };

    return (
        <div>
            <h1>API Data Input</h1>
            <textarea
                value={inputData}
                onChange={handleInputChange}
                placeholder='Enter JSON like {"data": ["a", "b", "1", "2", "c"]}'
                rows={5}
                style={{ width: '100%' }}
            />
            <button onClick={handleSubmit}>Submit</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>Select Data Type:</label>
                <div>
                    <button
                        onClick={() => handleOptionClick('numbers')}
                        style={{
                            backgroundColor: selectedOptions.includes('numbers') ? 'black' : 'grey',
                            color: "white",
                            marginRight: "10px"
                        }}
                    >
                        Numbers
                    </button>
                    <button
                        onClick={() => handleOptionClick('alphabets')}
                        style={{
                            backgroundColor: selectedOptions.includes('alphabets') ? 'black' : 'grey',
                            color: "white",
                            marginRight: "10px"
                        }}
                    >
                        Alphabets
                    </button>
                    <button
                        onClick={() => handleOptionClick('highest_lowercase_alphabet')}
                        style={{
                            backgroundColor: selectedOptions.includes('highest_lowercase_alphabet') ? 'black' : 'grey',
                            color: "white"
                        }}
                    >
                        Highest Lowercase Alphabet
                    </button>
                </div>
            </div>

            <div>
                <h2>Response Data:</h2>
                {renderResponseData()}
            </div>
        </div>
    );
}

export default ApiDataComponent;
