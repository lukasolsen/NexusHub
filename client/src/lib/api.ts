const MAIN_URI = "https://192.168.10.142:5000/api/v2/";

export const login = async (username: string, password: string) => {
  const response = await fetch(MAIN_URI + "user/login", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await fetch(MAIN_URI + "user/register", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const currentUser = async (token: string) => {
  const response = await fetch(MAIN_URI + "user/current", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  return response.json();
};
