
async function authorize() {
  try {
    const redirectUrl = chrome.identity.getRedirectURL();
    const clientId = 'MmLZJv_zbIW6f5BqN8gdRavj6nbIA4LjL5kqt1WpQcY';
    const responseType = 'code';
    const scope = '';
    const url = `https://shikimori.one/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}&scope=${scope}`;
    const result = await new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({ url: url, interactive: true }, resolve);
    });
    const code = new URLSearchParams(new URL(result).search).get('code');
    const clientSecret = '8UYvZpFUOAIZNl8oOsaAbZvvX3REunfPLfSz8Lyc3wc';
    const grantType = 'authorization_code';
    const tokenUrl = 'https://shikimori.one/oauth/token';
    const body = new URLSearchParams({
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    grant_type: grantType,
    });
    const tokenOptions = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
    };
    const tokenResponse = await fetch(tokenUrl, tokenOptions);
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    return accessToken;
    } catch (error) {
    console.error(error);
    }
    }
    
    // Функция для загрузки данных пользователя после получения токена доступа
    async function loadUser(token) {
    try {
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
    } catch (error) {
    console.error(error);
    }
    }
    
    // Нажатие на кнопку "Авторизоваться"
    document.getElementById('loginButton').addEventListener('click', async () => {
    try {
    // Авторизуем пользователя
    const accessToken = await authorize();
    // Загружаем данные пользователя
const user = await loadUser(accessToken);

// Выводим данные пользователя в консоль
console.log(user);
} catch (error) {
    console.error(error);
    }
    });