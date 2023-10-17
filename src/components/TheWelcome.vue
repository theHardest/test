<script setup lang="ts">
import { onMounted } from 'vue'
declare global {
  interface Window {
    Telegram: any
    TelegramWebviewProxy: any
  }
}
const Telegram = window.Telegram
// Init TWA
Telegram.WebApp.ready()

// Event occurs whenever theme settings are changed in the user's Telegram app (including switching to night mode).
Telegram.WebApp.onEvent('themeChanged', function () {
  document.documentElement.className = Telegram.WebApp.colorScheme
})

// Show main button
Telegram.WebApp.MainButton.setParams({
  text: 'Main Button'
})
Telegram.WebApp.MainButton.onClick(function () {
  Telegram.WebApp.showAlert('Main Button was clicked')
})
Telegram.WebApp.MainButton.show()

// Function to call showPopup API
function showPopup() {
  Telegram.WebApp.showPopup(
    {
      title: 'Title',
      message: 'Some message',
      buttons: [{ id: 'link', type: 'default', text: 'Open ton.org' }, { type: 'cancel' }]
    },
    function (btn: any) {
      if (btn === 'link') {
        Telegram.WebApp.openLink('https://ton.org/')
      }
    }
  )
}

// Function to toggle main TWA button
function toggleMainButton() {
  if (Telegram.WebApp.MainButton.isVisible) {
    Telegram.WebApp.MainButton.hide()
  } else {
    Telegram.WebApp.MainButton.show()
  }
}

// window.parent.postMessage(
//   JSON.stringify({
//     eventType: 'web_app_setup_back_button',
//     eventData: { is_visible: true }
//   }),
//   'https://web.telegram.org'
// )

window.TelegramWebviewProxy.postEvent(
  'web_app_setup_back_button',
  JSON.stringify({
    is_visible: true
  }),
  'https://web.telegram.org'
)

Telegram.WebApp.setHeaderColor('secondary_bg_color')

Telegram.WebApp.onEvent('themeChanged', function () {
  document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor)
})
onMounted(() => {
  function setViewportData() {
    var sizeEl = document.getElementById('viewport-params-size')
    if (!sizeEl) return
    sizeEl.innerText =
      'width: ' + window.innerWidth + ' x ' + 'height: ' + Telegram.WebApp.viewportStableHeight

    var expandEl = document.getElementById('viewport-params-expand')
    if (!expandEl) return
    expandEl.innerText = 'Is Expanded: ' + (Telegram.WebApp.isExpanded ? 'true' : 'false')
  }
  setViewportData()
  Telegram.WebApp.onEvent('viewportChanged', setViewportData)
})
</script>

<template>
  <main>
    <h1>Modals</h1>
    <button @click="Telegram.WebApp.showAlert('Hello World!')">Launch Alert</button>
    <button @click="showPopup">Launch Popup</button>

    <h1>Links</h1>
    <ul>
      <li>
        <a href="javascript:Telegram.WebApp.openTelegramLink('https://t.me/trendingapps');"
          >Open link within Telegram</a
        >
      </li>
      <li>
        <a href="javascript:Telegram.WebApp.openLink('https://ton.org/');"
          >Open link in external browser</a
        >
      </li>
      <li>
        <a
          href="javascript:Telegram.WebApp.openLink('https://telegra.ph/api',{try_instant_view:true});"
          >Open link inside Telegram webview</a
        >
      </li>
    </ul>

    <h1>Buttons</h1>
    <button @click="Telegram.WebApp.expand">Expand Webview</button>
    <button @click="toggleMainButton">Toggle Main Button</button>
  </main>
  <div id="viewport"></div>
  <div id="viewport-params-size"></div>
  <div id="viewport-params-expand"></div>
</template>
