import { supabase } from "../Client";

const logOutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout Error:", error.message);
    return { data: null, error: error.message };
  }

  return { data: "Logged out successfully", error: null };
};

export default logOutUser;
