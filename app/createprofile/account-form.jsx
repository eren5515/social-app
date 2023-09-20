"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Avatar from "./avatar.jsx";
import "../styles/createprofile.scss";

export default function AccountForm({ session }) {
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState("");
  const [uniquename, setUniquename] = useState("");
  const [bio, setBio] = useState(null);

  const [avatar_url, setAvatarUrl] = useState(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("user_profiles")
        .select(`user_name, unique_name, avatar_url, user_bio`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.user_name);
        setUniquename(data.unique_name);
        setAvatarUrl(data.avatar_url);
        setBio(data.user_bio);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ fullname, avatar_url, bio, uniquename }) {
    if (avatar_url != null) {
      try {
        setLoading(true);

        const { error, status } = await supabase
          .from("user_profiles")
          .upsert({
            id: user?.id,
            user_name: fullname,
            avatar_url,
            user_bio: bio,
            unique_name: uniquename,
          })
          .eq("id", user?.id);

        const statusCode = status;

        if (error) throw error;
        location.reload();

        alert("Profile updated!");
      } catch (error) {

        
         if ( error.message =="new row for relation \"user_profiles\" violates check constraint \"user_profiles_unique_name_check\""){
          alert("Username must be at least 4 character!");
        }
        else if (error.message=="duplicate key value violates unique constraint \"user_profiles_unique_name_key\""){
          alert("Username already exists!");


          
        }
       
          else {
            alert("Error updating the data!");
            console.log(error);
          }
          
       
        
       
      }
     
      
      finally {
        setLoading(false);
      }
    } else if (avatar_url == null) {
      try {
        setLoading(true);

        const { error , status } = await supabase
          .from("user_profiles")
          .upsert({
            id: user?.id,
            user_name: fullname,
            user_bio: bio,
            unique_name: uniquename,
          })
          .eq("id", user?.id);

        if (error) throw error;
        location.reload();

        alert("Profile updated!");
      } catch (error) {
        if (status == 409)

        alert("Error updating the data!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function removeAvatar() {
    const { error } = await supabase
      .from("user_profiles")
      .update({ avatar_url: "no-avatar/avatar-no-image.png" })
      .eq("id", user?.id);
    location.reload();
    alert("Avatar removed!");
  }
 
  function setUniqueName(value) {
    var loweredValue=value.toLowerCase();
    setUniquename(loweredValue.replace(/\s/g, ""));
    
  }

  return (
    <div className="form-widget">
      <div className="form-left">
        <div>
          <Avatar
            removeAvatar={removeAvatar}
            uid={user.id}
            url={avatar_url}
            size={300}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ fullname, avatar_url: url, bio, uniquename });
            }}
          />
        </div>
      </div>
      <div className="form-right">
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session?.user.email} disabled />
        </div>
        <div className="form-element">
          <label htmlFor="uniqueName">Username</label>
          <input
            id="uniqueName"
            type="text"
            value={uniquename || ""}
            onChange={(e) => setUniqueName(e.target.value)}
          />
        </div>
        <div className="form-element">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="form-element">
          <label htmlFor="bio">Bio</label>
          <input
            id="bio"
            type="text"
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button
            className="button primary block blue-btn"
            onClick={() => updateProfile({ fullname, avatar_url, bio, uniquename })}
            disabled={loading || fullname.length == 0 || uniquename.length==0}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
          <form action="/auth/signout" method="post">
            <button className="button block blue-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
        <Link href="/">Return to Home Page</Link>
      </div>
    </div>
  );
}
