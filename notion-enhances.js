// ==UserScript==
// @name         Notion Enhances
// @namespace    Violentmonkey Scripts
// @version      2024-10-08
// @description  try to take over the world!
// @author       You
// @match        https://www.notion.so/Collezione-giochini*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener

// ==/UserScript==

(function() {
  //VARIABLES
  var keystrokeMap = {};

  // Change background color adding a fade animation matching the first tag color
  function bgColor(node) {
      let propertyValueElement = node.querySelector('[data-testid="property-value"]');
      if (propertyValueElement) {
          let secondDiv = propertyValueElement.querySelectorAll("div")[1];
          if (secondDiv) {
              let bgColor = window.getComputedStyle(secondDiv).backgroundColor;
                node.style.position = "relative";
                node.style.borderRadius = "12px"; // Mantiene gli angoli arrotondati
                node.style.overflow = "hidden";
                node.style.background = `linear-gradient(${bgColor} 30%, transparent 70%) 0% 0% / 120% 120%`;
                node.style.animation = "gradientFade 4s ease-in-out infinite alternate";
          }
      }
  }
  // Change border color matching the first tag color
  function borderColor(node) {
      let propertyValueElement = node.querySelector('[data-testid="property-value"]');
      if (propertyValueElement) {
          let secondDiv = propertyValueElement.querySelectorAll("div")[1];
          if (secondDiv) {
            let bgColor = window.getComputedStyle(secondDiv).backgroundColor;
            node.style.border = `3px solid ${bgColor}`;
            node.style.borderRadius = "10px";
            node.style.boxShadow = `0 0 10px ${bgColor}`;
          }
      }
  }
  // Function that shows/hide properties
  function showProperties(event) {
    let checked = event.currentTarget.checked;
    let nodes = document.querySelectorAll(".notion-collection-item");
    if(!checked) {
      nodes.forEach((node) => {
        //Change background color for better looks
        let propertyValueElement = node.querySelector('[data-testid="property-value"]').querySelectorAll("div")[1];
        backColor = window.getComputedStyle(propertyValueElement).backgroundColor;
        node.style.background = `linear-gradient(${backColor} 70%, transparent 90%) 0% 0% / 110% 110%`;

        let allDivs = Array.from(node.querySelector("a").children).filter(child => child.tagName === "DIV");
        let propertiesDiv = allDivs[allDivs.length - 1];
        propertiesDiv.style.display = "none";
      });
    }else{
      nodes.forEach((node) => {
        bgColor(node);
        let allDivs = Array.from(node.querySelector("a").children).filter(child => child.tagName === "DIV");
        let propertiesDiv = allDivs[allDivs.length - 1];
        propertiesDiv.style.display = "flex";
      });
    }
  }
  // Function that add settings button with a little modal
  function addSettings(node) {
    if (node.children.length > 1) {
      let buttonsContainer = node.children[1];

      if (buttonsContainer.querySelector(".custom-button")) return;

      let button = document.createElement("div");
      button.className = "custom-button";
      let referenceButton = buttonsContainer.querySelector("[role='button']");
      if (referenceButton) {
        const styles = window.getComputedStyle(referenceButton);
        if (styles.cssText !== '') {
            button.style.cssText = styles.cssText;
        } else {
            const cssText = Object.values(styles).reduce(
                (css, propertyName) =>
                    `${css}${propertyName}:${styles.getPropertyValue(
                        propertyName
                    )};`
            );
            button.style.cssText = cssText
        }
      }
      button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
              <path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7L336 192c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
          </svg>
      `;

      buttonsContainer.appendChild(button);

      let modal = document.createElement('div');
      modal.className = 'custom-modal';
      modal.style = "display: none; color: white; background: black; position: absolute; right: 30px; top: 46px; padding: 8px; border-radius: 8px";

      modal.innerHTML = `
          <div class="modal-content">
            <div style="display: inline-grid">
              <div class="setting">
                  <input type="checkbox" id="bgColor" name="bgColor">
                  <label for="bgColor">Background colors</label>
              </div>
              <div class="setting">
                  <input type="checkbox" id="borderColor" name="borderColor">
                  <label for="borderColor">Border colors</label>
              </div>
              <div class="setting">
                  <input type="checkbox" id="showProperties" name="showProperties" checked="">
                  <label for="showProperties">Show properties (Alt + \\)</label>
              </div>
            </div>
            <div style="display: inline-grid">
              <div class="close-button" style="color: red; cursor: pointer; font-size: 16px;">&times;</div>
            </div>
          </div>
      `;

      document.body.appendChild(modal);

      function setValue(event) {
        const checkbox = event.target;
        GM_setValue(checkbox.id, checkbox.checked);
      }

      modal.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        if(checkbox.id == "showProperties"){
          checkbox.checked = true;
          checkbox.addEventListener("change", showProperties);
          //Add listener for Alt + \
          document.addEventListener("keydown", (event) => {
            if (event.key === "Alt" || event.key === "\\") {
              keystrokeMap[event.key] = true;
              if( keystrokeMap.hasOwnProperty("Alt") && keystrokeMap.hasOwnProperty("\\") ){
                checkbox.checked = !checkbox.checked;
                showProperties({currentTarget: checkbox});
              }
            }
          });

          document.addEventListener("keyup", (event) => {
            if (event.key === "Alt" || event.key === "\\") delete keystrokeMap[event.key];
          });

          return;
        }
        const savedValue = GM_getValue(checkbox.id, false);
        checkbox.checked = savedValue;
        checkbox.addEventListener("change", setValue);
      });

      button.addEventListener('click', () => {
        modal.style.display = modal.style.display == "block" ? "none" : "block";
      });

      modal.querySelector('.close-button').addEventListener('click', () => {
        modal.style.display = 'none';
      });

    }
  }

  // let gameWheelContent = "";
  // let gameWheelNode = null;
  // let editorNode = null;

  // function gameWheel(node) {
  //     gameWheelContent = node.innerHTML;
  //     if(gameWheelNode == null){
  //       gameWheelNode=node;
  //     }else{
  //       node=gameWheelNode;
  //     }

  //     if(node==null) return;

  //     if (editorNode) {
  //         basicEditor.innerHTML = gameWheelContent;
  //     }

  //     if (!node.dataset.listenerAdded) {
  //         const observer = new MutationObserver(() => {
  //             gameWheel(node);
  //         });
  //         observer.observe(node, { childList: true, subtree: true, characterData: true });
  //         node.dataset.listenerAdded = "true";
  //     }
  // }


  // Base function
  function mutationCallback(mutationsList, observer) {
      mutationsList.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
              if (node.classList && node.classList.contains("notion-topbar-action-buttons")) {
                addSettings(node);
              }
              if (node.classList && node.classList.contains("notion-collection-item")) {
                // bgColor
                if( GM_getValue("bgColor", true)){ bgColor(node); }
                // borderColor
                if( GM_getValue("borderColor", false)){ borderColor(node); }
              }
              // if(node.innerText && node.innerText.includes("#giochi-ruota")){
              //   gameWheel(node);
              // }
              // if(node.classList && node.classList.contains("basic-editor")){
              //   editorNode = node;
              //   gameWheel(null);
              // }
          });
      });
  }

  // Aggiunta dell'animazione CSS globale
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes gradientFade {
    0% {
      background-position: 50% 20%;
    }
    100% {
      background-position: 50% 90%;
    }
  }`;
  document.head.appendChild(style);

  // Dont wanna implements colors restoration
  // GM_addValueChangeListener("bgColor", () => {
  //   if(GM_getValue("bgColor", false)){
  //     document.querySelectorAll(".notion-collection-item").forEach((node) => {
  //       bgColor(node);
  //     });
  //   }
  // });
  // GM_addValueChangeListener("borderColor", () => {
  //   if(GM_getValue("borderColor", false)){
  //     document.querySelectorAll(".notion-collection-item").forEach((node) => {
  //       borderColor(node);
  //     });
  //   }
  // });

  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, { childList: true, subtree: true });

})();
