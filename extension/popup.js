document.addEventListener("DOMContentLoaded", () => {
  const tabList = document.getElementById("tab-list");
  const tabTemplate = document.getElementById("tab-template");


  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      addTabToUI(tab.id, tab.title || tab.url);
    });
  });


  function addTabToUI(tabId, title) {
    const tabElement = tabTemplate.content.cloneNode(true);
    const tabDetails = tabElement.querySelector(".tab-details");
    const tabActions = tabElement.querySelector(".tab-actions");


    const tabTitle = tabDetails.querySelector(".tab-title");
    tabTitle.textContent = title;

    const timeElement = tabDetails.querySelector(".time");
    timeElement.textContent = "Time: Not Set";


    const timerInput = tabActions.querySelector(".timer-input");
    const setTimerBtn = tabActions.querySelector(".set-timer-btn");
    const closeBtn = tabActions.querySelector(".close-btn");


    setTimerBtn.addEventListener("click", () => {
      const timerValue = parseInt(timerInput.value, 10);
      if (!isNaN(timerValue) && timerValue > 0) {
        startTabTimer(tabId, timerValue, timeElement, tabElement);
      } else {
        alert("Please enter a valid time in seconds.");
      }
    });

   
    closeBtn.addEventListener("click", () => {
      chrome.tabs.remove(tabId, () => {
        tabElement.remove();
      });
    });

    tabList.appendChild(tabElement);
  }

 
  function startTabTimer(tabId, seconds, timeElement, tabElement) {
    const intervalId = setInterval(() => {
      seconds--;
      timeElement.textContent = `Closing in: ${seconds}s`;

      if (seconds <= 0) {
        clearInterval(intervalId);
        chrome.tabs.remove(tabId, () => {
          tabElement.remove();
        });
      }
    }, 1000);
  }
});
