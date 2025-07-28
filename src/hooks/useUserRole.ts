import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('role')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // Default to user role
        } else {
          setRole(data?.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator' || role === 'admin';
  const isUser = role === 'user';

  return {
    role,
    loading,
    isAdmin,
    isModerator,
    isUser,
  };
};