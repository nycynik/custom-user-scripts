// ==UserScript==
// @name          Remember user settings for Kaltura media player.
// @namespace     gatech.edu
// @description   Preserves user settings between Kaltura media/video sessions.
// @version       0.1.0
// @match         *://canvasgatechtest.kaf.kaltura.com/*
// @match         *://cdnapisec.kaltura.com/*
// @grant         none
// @author        Emily Reese
// @description   1/16/2020, 11:29:39 AM
// ==/UserScript==

kWidget.addReadyCallback(playerId => {
  let kdp = document.getElementById(playerId);
  kdp.kBind("playerReady", function() {
    applyExistingSettings(kdp);
    createListeners(kdp);
  });
});

function createListeners(player) {
  player.kBind("changedClosedCaptions", event => {
    event.language
      ? localStorage.setItem("captionLanguage", event.language)
      : localStorage.removeItem("captionLanguage");
  });

  player.kBind("updatedPlaybackRate", newRate => {
    localStorage.setItem("playbackRate", newRate);
  });

  player.kBind("volumeChanged", event => {
    localStorage.setItem("volumeLevel", event.newVolume);
  });
}

function applyExistingSettings(player) {
  let captionLanguage = localStorage.getItem("captionLanguage");
  if (captionLanguage) {
    player.sendNotification("showHideClosedCaptions", captionLanguage);
  }

  let playbackRate = localStorage.getItem("playbackRate");
  if (playbackRate) {
    player.sendNotification("playbackRateChangeSpeed", playbackRate);
  }

  let volumeLevel = localStorage.getItem("volumeLevel");
  if (volumeLevel) {
    player.sendNotification("changeVolume", volumeLevel);
  }
}
