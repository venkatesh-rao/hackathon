import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

// console.log(document.getElementsByTagName('body'));

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   chrome.tabs.get(activeInfo.tabId, (info) => {
//     // alert(JSON.stringify(info));
//     axios({
//       url: 'http://c4401d5b.ngrok.io',
//       method: 'post',
//       data: {
//         query: `
//           mutation History {
//             history(userId: "venkateshrao@designqube.in", url: "${
//               info.url
//             }", title: "${info.title}", mode: "${
//           info.incognito ? 'incognito' : 'normal'
//         }")
//           }
//           `,
//       },
//     })
//       .then((result) => {
//         console.log(result.data);
//       })
//       .catch((err) => console.log(err));
//   });
// });

// chrome.windows.onFocusChanged.addListener((winId) => {
//   axios({
//     url: 'http://c4401d5b.ngrok.io',
//     method: 'post',
//     data: {
//       query: `
//         mutation Idle {
//           idle
//         }
//         `,
//     },
//   }).then((result) => {
//     console.log(result.data);
//   });
// });
