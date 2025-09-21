import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    // First, create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'hunainm.qureshi@gmail.com',
      password: 'Samurai14@',
      options: {
        data: {
          role: 'admin',
          full_name: 'Hunain Qureshi'
        }
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('User created successfully:', authData.user?.id);

    // Wait a moment for the user to be created
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'hunainm.qureshi@gmail.com',
        full_name: 'Hunain Qureshi',
        role: 'admin',
        email_verified: true,
        profile_completed: true,
        status: 'active'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    // Create admin user record
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: authData.user.id,
        admin_level: 'super_admin',
        permissions: { all: true },
        is_active: true
      });

    if (adminError) {
      console.error('Error creating admin user:', adminError);
      return;
    }

    console.log('Admin user created successfully!');
    console.log('User ID:', authData.user.id);
    console.log('Email:', 'hunainm.qureshi@gmail.com');
    console.log('Admin Level: super_admin');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();
