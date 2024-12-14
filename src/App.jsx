import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const [athlete, setAthlete] = useState("LeBron James");
  const [careerData, setCareerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Ensures only one API call at a time

  const handleGenerate = async () => {
    if (isGenerating) return; // Prevent multiple API calls
    setIsGenerating(true);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
        {
          contents: [
            {
              parts: [
                {
                  text: `
                  Make this into a JSON format, listing all 11 components. Ensure the lists are comma separated.
                  Example: {"Position Played": "...", "Teams Played": ".."}. The output should be exactly the same format as a json file.

                 Just display the contents inside the JSON. Pretend its a normal JSON file being parsed.

                  (1) Position Played: Find the most common position played by ${athlete}

                  (2) Teams Played: [list ${athlete}'s teams years played in chronological order, comma separated--- ex: "Mavericks (2016-2020), Lakers (2020-2018)]" that's just an example don't fill it in unless true

                  (3) Accomplishments: [list ${athlete}'s accomplishments individual and championships] -- make this comma separated

                  (4) Years Played: [${athlete}'s year played ---- ex: "2016-2020] \n\n
                  
                  (5) Minutes per Game: [How many minues per game on average did ${athlete} play throughout his career]

                  (6) Points Per Game: [${athlete}'s point per game career average] \n\n

                  (7) Rebounds Per Game: [${athlete}'s rebounds per game career average] \n\n

                  (8) Assists Per Game: [${athlete}'s assists per game career average] \n\n
                  
                  (9) Field Goal Percentage: [${athlete}'s Field Goal Percentage career average] \n\n
                  
                  (10) Free Throw Percentage: [${athlete}'s Free Throw Percentage career average] \n\n

                  (11) Summary: Now give me a 1 paragraph summary of ${athlete}'s NBA career --- restrict it to 2000 characters] --- no using " to denote the height instead of 7'7" say 7 feet 7 inches
                `,
                },
              ],
            },
          ],
        }
      );
      let result;
      try {
        result = JSON.parse(response.data.candidates[0].content.parts[0].text || "{}");
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        result = { RawResponse: response.data.candidates[0].content.parts[0].text };
      }
      setCareerData(result);
    } catch (error) {
      console.error("Error fetching career description:", error);
      setCareerData({ error: "Error fetching data" });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <div style={styles.app}>
      <h1>NBA Player Encyclopedia</h1>
      <div style={styles.inputContainer}>
        <label htmlFor="athlete" style={styles.label}>Athlete Name:</label>
        <input
          id="athlete"
          type="text"
          value={athlete}
          onChange={(e) => setAthlete(e.target.value)}
          style={styles.input}
        />
      </div>
      <button style={styles.button} onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate"}
      </button>
      <div style={styles.panel}>
        {isLoading ? (
          <p>Loading...</p>
        ) : careerData ? (
          Object.entries(careerData).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  app: {
    padding: "16px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  label: {
    marginRight: "8px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    width: "200px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 20px",
    margin: "20px 0",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  panel: {
    border: "1px solid black",
    padding: "16px",
    margin: "16px auto",
    width: "80%",
    textAlign: "left",
  },
};

export default App;
