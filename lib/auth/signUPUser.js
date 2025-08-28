import { supabase } from "../Client";

const signUpUser = async (name, email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.log("SignUp Error:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.log("Unexpected error", err);
    return { data: null, error: "Something went wrong" };
  }
};

export default signUpUser;
