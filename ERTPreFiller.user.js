// ==UserScript==
// @name         ERT PreFiller
// @namespace    http://tampermonkey.net/
// @tag          ERT
// @version      0.0.1
// @description  try to take over the world one byte at a time. 9-8-26
// @author       The Wizard - Jeff Daniels (dnije)
// @match        https://learn.amazon.com/tasks/*/*
// @grant        none
// ==/UserScript==

/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
     */

(function() {
    'use strict';
    const keywords = ['yes', 'demonstrated', 'pass', 'miles'];

    let running = false;

    async function runAutoSelect() {

        if (running) {
            console.log('Auto Select is already running.');
            return;
        }

        running = true;

        const button = document.getElementById('tm-auto-select-button');

        if (button) {
            button.textContent = 'Running...';
            button.disabled = true;
        }

        console.log('Auto Select started.');

        try {

            while (true) {

                const next = [...document.querySelectorAll(
                    'input[type="radio"], button'
                )].find(el => {

                    const value = (
                        el.value ||
                        el.textContent ||
                        ''
                    )
                    .toLowerCase()
                    .trim();

                    return keywords.includes(value) && !el.checked;
                });

                if (!next)
                { break; }

                next.click();

                await new Promise(resolve =>
                    setTimeout(resolve, 25)
                );
            }

            console.log('Auto Select finished.');

        } finally {

            running = false;

            if (button) {
                button.textContent = 'Run Auto-Select';
                button.disabled = false;
            }
        }
    }


    /*
     * Floating button
     */

    function createButton() {

        const button = document.createElement('button');

        button.id = 'tm-auto-select-button';
        button.textContent = 'Run Auto-Select';

        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            padding: '10px 16px',
            background: '#222',
            color: '#fff',
            border: '1px solid #888',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,.35)'
        });

        button.addEventListener('click', runAutoSelect);

        document.body.appendChild(button);
    }


    /*
     * Keyboard shortcut:
     *
     * ALT + SHIFT + A
     */

    document.addEventListener('keydown', event => {

        if (
            event.altKey &&
            event.shiftKey &&
            event.key.toLowerCase() === 'a'
        ) {
            event.preventDefault();
            runAutoSelect();
        }

    });


    /*
     * Tampermonkey menu option
     */

    GM_registerMenuCommand(
        'Run Auto-Select',
        runAutoSelect
    );


    /*
     * Wait until page body exists
     */

    if (document.body) {
        createButton();
    } else {
        window.addEventListener('DOMContentLoaded', createButton);
    }

    // Your code here...
})();