document.addEventListener("DOMContentLoaded", function() {


    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector("easy-progress");
    const mediumProgressCircle = document.querySelector("medium-progress");
    const hardProgressCircle = document.querySelector("hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

//return true or false based on regex 
function validateUsername(username) {
    if(username.trim() === "") {
        alert("Username should not be empty");
        return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if(!isMatching) {
        alert("Invalid Username");
    }
    return isMatching;
}

async function  fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`
    try{
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Unable to fetch the user details");
        }
        const parsedData = await response.json();
        console.log("Logging data: ", parsedData);

        displayUserData(parsedData);
    }
    catch(Error) {
        statsContainer.innerHTML = `<p>${Error.message}</p>`
    }
    finally{
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedtotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedtotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedtotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedtotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedtotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedtotalHardQues, totalHardQues, hardLabel, hardProgressCircle);
    }

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        console.log("loggin username: ",username);
        if(validateUsername(username)) {
            fetchUserDetails(username);
        }
    })
})