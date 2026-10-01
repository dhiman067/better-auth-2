'use client'
import { useSession } from '@/lib/auth-client';
import React from 'react';

const ProfilePage = () => {
    const {data:session} = useSession()
    return (
        <div>
           {`Welcome ${session?.user.name}`}
        </div>
    );
};

export default ProfilePage;