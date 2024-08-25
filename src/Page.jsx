import { useState } from 'react';

function ApiDataComponent() {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('numbers');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
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
        if (!responseData) return null;

        const { numbers, alphabets, highest_lowercase_alphabet } = responseData;

        switch (selectedOption) {
            case 'numbers':
                return numbers.length > 0 ? numbers.join(', ') : 'No numbers found';
            case 'alphabets':
                return alphabets.length > 0 ? alphabets.join(', ') : 'No alphabets found';
            case 'highest_lowercase_alphabet':
                return highest_lowercase_alphabet.length > 0 ? highest_lowercase_alphabet.join(', ') : 'No lowercase alphabet found';
            default:
                return 'Select a valid option';
        }
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
                <label htmlFor="data-type">Select Data Type:</label>
                <select id="data-type" value={selectedOption} onChange={handleOptionChange}>
                    <option value="numbers">Numbers</option>
                    <option value="alphabets">Alphabets</option>
                    <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
                </select>
            </div>

            <div>
                <h2>Response Data:</h2>
                <p>{renderResponseData()}</p>
            </div>
        </div>
    );
}

export default ApiDataComponent;
