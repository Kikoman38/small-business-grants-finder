import React from 'react';
import { Grant } from '../types';
import Calendar from './Calendar';
import NewsFeed from './NewsFeed';

interface DashboardProps {
    grants: Grant[];
    selectedState: string;
}

const Dashboard: React.FC<DashboardProps> = ({ grants, selectedState }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6 mb-6">
            <div className="lg:col-span-3">
                <Calendar grants={grants} />
            </div>
            <div className="lg:col-span-2">
                <NewsFeed selectedState={selectedState} />
            </div>
        </div>
    );
};

export default Dashboard;
