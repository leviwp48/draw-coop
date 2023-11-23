import "./User.css";
 
const User = ({user, userImage}) =>{
        return (
            <div className="user-container">
                <img className="user-image" src={userImage} alt="no image"/>
               <div className="user-name"> {user} </div>
            </div>
        )
    }
    
export default User; 