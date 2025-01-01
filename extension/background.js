let tabTimes = {}; 
let activeTabId = null;  


function saveTabTimes() {
  chrome.storage.local.set({ tabTimes: tabTimes });
}


chrome.tabs.onActivated.addListener(function(activeInfo) {
  const activeTabId = activeInfo.tabId;
  const currentTime = Date.now();


  if (tabTimes[activeTabId]) {
    const lastActiveTime = Date.now() - tabTimes[activeTabId].startTime;
    tabTimes[activeTabId].timeSpent += lastActiveTime;
  }


  tabTimes[activeTabId] = {
    id: activeTabId,
    startTime: currentTime,
    timeSpent: tabTimes[activeTabId]?.timeSpent || 0
  };

  saveTabTimes();  
});


chrome.tabs.onRemoved.addListener(function(tabId) {
  if (tabTimes[tabId]) {
    delete tabTimes[tabId];  
    saveTabTimes();  
  }
});
