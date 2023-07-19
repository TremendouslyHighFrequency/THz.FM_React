import axios from 'axios';

export async function getLoggedUser() {
  try {
    const response = await axios.get('https://thz.fm/api/method/frappe.auth.get_logged_user');
    return response.data.message;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

export async function getNotifications(loggedUser: string) {
  try {
    const response = await axios.get(`https://thz.fm/api/resource/Notification Log?filters=[["Notification Log","for_user","=","${loggedUser}"]]&fields=["subject","email_content","type","document_type","read","document_name","attached_file","attachment_link","from_user", "from_user.user_image"]`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

export async function getUserImage(loggedUser: string) {
  try {
    const response = await axios.get(`https://thz.fm/api/Resource/User?fields=["user_image[0]"]&filters=[["User","owner","=","${loggedUser}"]]`);
    return response.data.data.user_image;
  } catch (error) {
    console.error(`Error fetching user data: ${error}`);
  }
}
