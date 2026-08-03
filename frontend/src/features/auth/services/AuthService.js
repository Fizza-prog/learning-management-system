const API_URL = "http://localhost:5000/api/auth";


export async function loginUser(credentials) {

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(credentials),
  });


  const data = await response.json();

  return data;
}


export async function signupUser(userData) {

  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });


  const data = await response.json();

  return data;
}