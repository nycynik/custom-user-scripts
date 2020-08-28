// ==UserScript==
// @name          Remember user settings for Kaltura media player.
// @namespace     gatech.edu
// @description   Preserves user settings between Kaltura media/video sessions.
// @version       0.1.0
// @match         *://canvasgatechtest.kaf.kaltura.com/*
// @match         *://cdnapisec.kaltura.com/*
// @match         *://gatech.instructure.com/courses/*
// @grant         none
// @author        Emily Reese
// @description   1/16/2020, 11:29:39 AM
// ==/UserScript==

(function() {
    'use strict';

    /* more details and docs on player: http://player.kaltura.com/docs/api
    */
    var waitForKWidgetCount = 0;

    function waitForKWidget( callback ) {
        waitForKWidgetCount++;
        if( waitForKWidgetCount > 200 ){
            if( console ){
                console.log( "Error kWidget never ready" );
            }
            return ;
        }
        if( ! window.kWidget ){
            setTimeout(function(){
                waitForKWidget( callback );
            }, 5 );
            return ;
        }
        callback();
    }
    waitForKWidget( function(){

        kWidget.addReadyCallback(playerId => {
            let kdp = document.getElementById(playerId);
           // kdp.kBind("playerReady", () => {
                applyExistingSettings(kdp);
                createListeners(kdp);
            //});
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

        player.kBind("playing", event => {
            updateRateSpeed();
        });

        player.kBind("playerPlayEnd", event => {
            // when video ends go to next.
            console.log("moving on..");
            //var nextButton = parent.document.querySelector('#module_navigation_target > div > div.module-sequence-footer > div > span.module-sequence-footer-button--next > a');
            //nextButton.click(); // click next button
        });

        player.kBind( 'mediaReady', () => {
            // play when ready
            player.sendNotification("doPlay");
        });
    }

    function updateRateSpeed() {
        let playbackRate = localStorage.getItem("playbackRate");
        let speedSelection = $('[title="' + playbackRate + 'x"]');
        if (playbackRate && speedSelection) {
            speedSelection.click();
        }
    }

    function applyExistingSettings(player) {
        let captionLanguage = localStorage.getItem("captionLanguage");
        if (captionLanguage) {
            player.sendNotification("showHideClosedCaptions", captionLanguage);
        }

        let volumeLevel = localStorage.getItem("volumeLevel");
        if (volumeLevel) {
            player.sendNotification("changeVolume", volumeLevel);
        }
    }
})();

