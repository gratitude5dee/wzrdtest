import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";

export function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/home");
      }
      if (event === "USER_UPDATED" && session) {
        navigate("/home");
      }
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12">
              <img src="/hume-logo.png" alt="Hume" className="w-full h-full" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Welcome to Hume</h2>
          <p className="mt-2 text-gray-600">Sign in or create an account to continue</p>
          <p className="mt-2 text-sm text-red-600">Note: During development, you need to use an authorized email domain.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#333333',
                  },
                },
              },
              className: {
                message: 'text-red-600 text-sm',
                label: 'text-gray-700 font-medium',
                button: 'bg-black hover:bg-gray-800',
                container: 'space-y-4',
                anchor: 'text-gray-600 hover:text-gray-800',
                divider: 'bg-gray-200',
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/home`}
            magicLink={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password (minimum 6 characters)',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in ...',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password (minimum 6 characters)',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up ...',
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}