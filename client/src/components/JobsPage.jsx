import React from 'react';
import JobHub from './JobHub';

const JobsPage = ({ setView }) => {
    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg)' }}>
            <JobHub />
        </div>
    );
};

export default JobsPage;
