import { FileText, Calendar, User, Clock } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
          View All
        </button>
      </div>
      
      <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div key={idx} className="relative flex items-start gap-4 group">
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-sm text-gray-900 leading-relaxed">
                  <span className="font-bold text-gray-800">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>{' '}
                  <span className="font-bold text-indigo-600">{activity.target}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400 font-medium">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
