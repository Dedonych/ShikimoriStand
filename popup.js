const loginButton = document.querySelector('#loginButton');
loginButton.addEventListener('click', async () => {
    try {
    // Получаем URL для авторизации OAuth2
    const authUrl = await getAuthorizationUrl();
    chrome.tabs.create({ url: authUrl });
    chrome.identity.onSignInChanged.addListener(async (account, signedIn) => {
        if (signedIn) {
          // Получаем токен доступа после завершения авторизации
          const token = await getToken();
      
          // Загружаем данные пользователя
          const user = await loadUser(token);
      
          // Выводим данные пользователя в консоль
          console.log(user);
        }
      });
    } catch (error) {
        console.error(error);
        }
        });
        // Функция для получения URL для авторизации OAuth2
async function getAuthorizationUrl() {
    const clientId = 'MmLZJv_zbIW6f5BqN8gdRavj6nbIA4LjL5kqt1WpQcY';
    const redirectUri = "urn:ietf:wg:oauth:2.0:oob"
    const responseType = 'code';
    const scope = '';
    const url = `https://shikimori.one/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
    return url;
    }
    
    // Функция для получения токена доступа после завершения авторизации
    async function getToken() {
    const redirectUrl = "urn:ietf:wg:oauth:2.0:oob"
    const code = location.href.split(/^.+[/]/g)[1];
    const clientId = 'MmLZJv_zbIW6f5BqN8gdRavj6nbIA4LjL5kqt1WpQcY';
    const clientSecret = '8UYvZpFUOAIZNl8oOsaAbZvvX3REunfPLfSz8Lyc3wc';
    const grantType = 'authorization_code';
    const url = 'https://shikimori.one/oauth/token';
    const options = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    grant_type: grantType,
    }),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const token = data.access_token;
    return token;
    }
    
    // Функция для загрузки данных пользователя после получения токена доступа
    async function loadUser(token) {
    const url = 'https://shikimori.one/api/users/whoami';
    const options = {
    headers: {
    'Authorization': `Bearer ${token}`,
    },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const user = {
    id: data.id,
    nickname: data.nickname,
    avatarUrl: data.avatar.original,
    };
    return user;
    }