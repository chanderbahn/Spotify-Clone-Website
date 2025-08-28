import { supabase } from "../Client";

const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login Error:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null }; // ✅ success case
  } catch (err) {
    console.log("Unexpected error:", err);
    return { data: null, error: "Something went wrong" };
  }
};

export default loginUser;
