type Notification = {
  type: string,
  from_user: string,
  document_name: string,
  email_content: string,
  user_image: string,
  // add other fields as necessary
};

type User = {
  user_image: string,
  // add other fields as necessary
};

type NavbarProps = {
  loggedUser: string | null,
};

type TrackItem = {
  title: string,
  track_artist: string
};

export { Notification, User, NavbarProps, TrackItem };
