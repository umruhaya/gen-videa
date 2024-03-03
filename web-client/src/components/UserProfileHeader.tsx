import styles from '../styles/UserProfileHeader.css';
import { Button } from "@/components/ui/moving-border.tsx";



interface User {
  name: string;
  username: string;
  profilePicture: string;
  coverPicture: string;
  email: string;
  location: string;
}

const dummyUser: User = {
  name: "Haider",
  username: "H4ID3R",
  profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  coverPicture: "https://flowbite.com/docs/images/examples/image-3@2x.jpg",
  email: "haider@hotmail.com",
  location: "Lahore, Pakistan"
};

// Define the type for the user props
type UserProps = {
  name: string;
  username: string;
  profilePicture: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  bio: string;
};

// Define the UserProfileHeader component with UserProps
const UserProfileHeader: React.FC<UserProps> = ({
  name,
  username,
  profilePicture,
  bio,
}) => {
  return (
    <div className="profile-header">
      <div className="container">
        <div className="profile">
          <div className="profile-image">
            <img
              src={profilePicture}
              alt={username}
            />
          </div>

          <div className="profile-user-settings">
            <h2 className="profile-user-name">{username}</h2>

            <a href="/UserSettings">
            <button className="btn profile-edit-btn">Edit Profile</button>
            </a>

            <button
              className="btn profile-settings-btn"
              aria-label="profile settings"
            >
              <i className="fas fa-cog" aria-hidden="true"></i>
            </button>
          </div>

          <div className="profile-bio">
            <p>
              <span className="profile-real-name">{name}</span> <br /> <br />
              {bio}
            </p>
          </div>
          <div>
          <a href="/upload"><Button>Create</Button></a>
          </div>
        </div>
      </div>
    </div>
  );
};



export default UserProfileHeader;

// import React from 'react';
// import { Button } from "@/components/ui/moving-border.tsx";
// import styles from '../styles/UserProfileHeader.css';

// interface User {
//   name: string;
//   username: string;
//   profilePicture: string;
//   coverPicture: string;
//   email: string;
//   location: string;
// }

// const dummyUser: User = {
//   name: "Haider",
//   username: "H4ID3R",
//   profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
//   coverPicture: "https://flowbite.com/docs/images/examples/image-3@2x.jpg",
//   email: "haider@hotmail.com",
//   location: "Lahore, Pakistan"
// };

// // Define the type for the user props
// type UserProps = {
//   name: string;
//   username: string;
//   profilePicture: string;
//   postCount: number;
//   followerCount: number;
//   followingCount: number;
//   bio: string;
// };

// // Define the UserProfileHeader component with UserProps
// const UserProfileHeader: React.FC<UserProps> = ({
//   name,
//   username,
//   profilePicture,
//   bio,
// }) => {
//   return (
//     <div className="profile-header">
//       <div className="container">
//         <div className="profile">
//           <div className="profile-image">
//             <img
//               src={profilePicture}
//               alt={username}
//             />
//           </div>

//           <div className="profile-user-settings">
//             <h2 className="profile-user-name">{username}</h2>

//             <a href="/upload">
//               <Button
//                 borderRadius="1.75rem"
//                 className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
//               >
//                 Upload
//               </Button>
//             </a>

//             <button
//               className="btn profile-settings-btn"
//               aria-label="profile settings"
//             >
//               <i className="fas fa-cog" aria-hidden="true"></i>
//             </button>
//           </div>

//           <div className="profile-bio">
//             <p>
//               <span className="profile-real-name">{name}</span> <br /> <br />
//               {bio}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfileHeader;


// {/* <a href="/upload"> {/* This is the new button */}
//               <button className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
//                 Upload
//               </button>
//             </a> */}
