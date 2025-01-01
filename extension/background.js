let tabTimes = {};  // Stores time spent 
let activeTabId = null;  // Stores the active tab

// Function to save tabTimes to chrome.storage
function saveTabTimes() {
  chrome.storage.local.set({ tabTimes: tabTimes });
}

// Update active tab time whenever tab is switched
chrome.tabs.onActivated.addListener(function(activeInfo) {
  const activeTabId = activeInfo.tabId;
  const currentTime = Date.now();

  // If there was a previously active tab, store time spent on it
  if (tabTimes[activeTabId]) {
    const lastActiveTime = Date.now() - tabTimes[activeTabId].startTime;
    tabTimes[activeTabId].timeSpent += lastActiveTime;
  }

  // Update the active tab's start time and timeSpent
  tabTimes[activeTabId] = {
    id: activeTabId,
    startTime: currentTime,
    timeSpent: tabTimes[activeTabId]?.timeSpent || 0
  };

  saveTabTimes();  
});

// Clean up the tabTimes when a tab is closed
chrome.tabs.onRemoved.addListener(function(tabId) {
  if (tabTimes[tabId]) {
    delete tabTimes[tabId];  
    saveTabTimes();  
  }
});
