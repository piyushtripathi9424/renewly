
import { SubscriptionList } from './SubscriptionList';
import { StatisticsCards } from './StatisticsCards';
import { UpcomingRenewalsWidget } from './UpcomingRenewalsWidget';

export const SubscriptionDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription Dashboard</h1>
      <StatisticsCards />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SubscriptionList />
        </div>
        <div>
          <UpcomingRenewalsWidget />
        </div>
      </div>
    </div>
  );
};
