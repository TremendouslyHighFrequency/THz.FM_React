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
  track_artist: string,
};

type ReleaseItem = {
  title: string,
  release_artist: string,
  release_date: string,
  release_artwork: string,
};

type ArtistItem = {
  title: string,
  artist_bio: string,
  artist_photo: string
};

export { Notification, User, NavbarProps, TrackItem, ReleaseItem, ArtistItem };
