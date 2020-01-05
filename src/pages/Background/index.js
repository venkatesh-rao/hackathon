import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import Axios from 'axios';

chrome.storage.local.get(['id'], (result) => {
  if (result.id) {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, (info) => {
        // alert(JSON.stringify(info));
        Axios({
          url: 'http://1a2005cb.ngrok.io',
          method: 'post',
          data: {
            query: `
          mutation History {
            history(userId: "${result.id}", url: "${info.url}", title: "${
              info.title
            }", mode: "${info.incognito ? 'incognito' : 'normal'}")
          }
          `,
          },
        })
          .then((result) => {
            console.log(result.data);
          })
          .catch((err) => console.log(err));
      });
    });

    chrome.windows.onFocusChanged.addListener((winId) => {
      if (winId === -1) {
        Axios({
          url: 'http://1a2005cb.ngrok.io',
          method: 'post',
          data: {
            query: `
        mutation Idle {
          idle
        }
        `,
          },
        }).then((result) => {
          console.log(result.data);
        });
      } else {
        chrome.tabs.getCurrent((info) => {
          Axios({
            url: 'http://1a2005cb.ngrok.io',
            method: 'post',
            data: {
              query: `
          mutation History {
            history(userId: "${result.id}", url: "${info.url}", title: "${
                info.title
              }", mode: "${info.incognito ? 'incognito' : 'normal'}")
          }
          `,
            },
          })
            .then((result) => {
              console.log(result.data);
            })
            .catch((err) => console.log(err));
        });
      }
    });
  }
});
